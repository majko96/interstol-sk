<?php

namespace App\Service;

use GuzzleHttp\Client;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

class GoogleReviewsService
{
    private FilesystemAdapter $cache;
    private string $placeId;
    private string $apiKey;

    public function __construct(
        string $googlePlaceId,
        string $googleApiKey
    ) {
        $this->cache = new FilesystemAdapter();
        $this->placeId = $googlePlaceId;
        $this->apiKey = $googleApiKey;
    }

    public function getReviews(): array
    {
        $cacheKey = 'google_place_reviews_' . $this->placeId;
        $cacheItem = $this->cache->getItem($cacheKey);
        $client = new Client();

        if (!$cacheItem->isHit()) {
            $url = 'https://maps.googleapis.com/maps/api/place/details/json';
            $params = [
                'place_id' => $this->placeId,
                'key' => $this->apiKey,
                'fields' => 'reviews',
                'reviews_sort' => 'newest',
                'reviews_no_translations' => true,
            ];

            $urlWithParams = $url . '?' . http_build_query($params);

            try {
                $response = $client->request('GET', $urlWithParams);
                $data = json_decode($response->getBody()->getContents(), true);
            } catch (\Exception $e) {
                throw new \RuntimeException('Error fetching data from Google API');
            }

            $cacheItem->set($data);
            $cacheItem->expiresAfter(7200);
            $this->cache->save($cacheItem);
        } else {
            $data = $cacheItem->get();
        }

        $reviews = [];
        if (isset($data['result']['reviews'])) {
            foreach ($data['result']['reviews'] as $review) {
                $reviews[] = [
                    'author_name' => $review['author_name'],
                    'rating' => $review['rating'],
                    'text' => $review['text'],
                    'profile_image' => $review['profile_photo_url'],
                    'time' => date('d.m.Y', $review['time']),
                ];
            }
        }

        return $reviews;
    }
}
