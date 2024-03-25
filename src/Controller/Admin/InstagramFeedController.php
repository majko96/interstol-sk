<?php

namespace App\Controller\Admin;

use App\Controller\ApiController;
use App\Controller\BaseController;
use App\Service\InstagramDataService;
use GuzzleHttp\Client;
use Psr\Cache\InvalidArgumentException;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class InstagramFeedController extends BaseController
{
    /**
     * @throws InvalidArgumentException
     */
    #[Route('/instagram-feed', name: 'admin_instagram_feed')]
    public function instagramFeed(): Response {

        $cache = new FilesystemAdapter();
        $key = 'last_request_time';
        $lastRequestTime = $cache->getItem($key)->get();
        date_default_timezone_set('Europe/Bratislava');

        $instagramFeedApiKey = $this->getParameter('instagram_feed_api_key');

        $instagramDataService = new InstagramDataService();
        $imageFiles = $instagramDataService->getCachedInstagramData();

        $localDateTime = date('d. m. Y H:i:s', $lastRequestTime);
        return $this->render('Admin/instagram_feed.html.twig', [
            'lastRequest' => $localDateTime,
            'instagramFeedApiKey' => $instagramFeedApiKey,
            'imageFiles' =>$imageFiles
            ]);
    }
}