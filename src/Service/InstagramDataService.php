<?php

namespace App\Service;

use Symfony\Component\Cache\Adapter\FilesystemAdapter;

class InstagramDataService
{
    public function getCachedInstagramData(): array
    {
        $cache = new FilesystemAdapter();
        $dataKey = 'data_key';
        $data = $cache->getItem($dataKey)->get();
        $cacheData = (unserialize($data));

        $instagramMedia = [];
        foreach ($cacheData as $oneMedia) {
            $itemData['id'] = $oneMedia->getId();
            $itemData['caption'] = $oneMedia->getCaption();
            $itemData['link'] = $oneMedia->getLink();
            $itemData['shortCode'] = $oneMedia->shortcode;
            $itemData['likes'] = $oneMedia->getLikes();
            $itemData['comments'] = $oneMedia->getComments();
            $itemData['height'] = $oneMedia->getHeight();
            $itemData['width'] = $oneMedia->getWidth();
            $instagramMedia[] = $itemData;
        }
        return $instagramMedia;
    }
}
