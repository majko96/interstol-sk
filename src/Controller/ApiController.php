<?php

namespace App\Controller;

use App\Service\InstagramDataService;
use Exception;
use GuzzleHttp\Exception\GuzzleException;
use Instagram\Exception\InstagramAuthException;
use Instagram\Exception\InstagramDownloadException;
use Instagram\Exception\InstagramException;
use Instagram\Model\Media;
use Psr\Cache\InvalidArgumentException;
use Random\RandomException;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Twig\Environment;
use Instagram\Api;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class ApiController extends AbstractController
{
    private Environment $twig;
    private MailerInterface $mailer;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig,
    ) {
        $this->twig = $twig;
        $this->mailer = $mailer;
    }

    /**
     * @throws SyntaxError
     * @throws TransportExceptionInterface
     * @throws RuntimeError
     * @throws LoaderError
     */
    #[Route('/api/send-message', name: 'api_send_message')]
    public function sendMessage(Request $request): JsonResponse
    {
        $defaultEmail = $this->getParameter('default_email');
        $image = $request->files->get('image');

        if ($image) {
            if (!is_dir('../public/uploads')) {
                mkdir('../public/uploads');
            }
            $imagePath = '../public/uploads/';
            $imageName = $image->getClientOriginalName();
            $image->move($imagePath, $imageName);
        }

        $template = $this->twig->render('Mail/message.html.twig', [
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'name' => $request->get('name'),
            'surname' => $request->get('surname'),
            'message' => $request->get('message'),
            'subject' => $request->get('subject'),
        ]);

        if ($image) {
            $email = (new TemplatedEmail())
                ->from($defaultEmail)
                ->to($defaultEmail)
                ->subject($request->get('subject'))
                ->attach(fopen($imagePath . $imageName, 'r'), $imageName)
                ->html($template);
        } else {
            $email = (new TemplatedEmail())
                ->from($defaultEmail)
                ->to($defaultEmail)
                ->subject($request->get('subject'))
                ->html($template);
        }

        try {
            $this->mailer->send($email);
            $this->mailer->send($email->to($request->get('email')));
            $response  = true;
        } catch (Exception $e) {
            $response = $e->getMessage();
        }
        
        return new JsonResponse($response);
    }

    /**
     * @throws SyntaxError
     * @throws TransportExceptionInterface
     * @throws RuntimeError
     * @throws LoaderError
     */
    #[Route('/api/send-reference', name: 'api_send_reference')]
    public function sendReference(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent());
        $defaultEmail = $this->getParameter('default_email');

        $template = $this->twig->render('Mail/referenceMail.html.twig', [
            'name' => $data->name,
            'surname' => $data->surname,
            'message' => $data->message,
            'rating' =>$data->rating
        ]);

        $email = (new TemplatedEmail())
            ->from($defaultEmail)
            ->to($defaultEmail)
            ->subject('Nová recenzia')
            ->html($template);

        try {
            $this->mailer->send($email);
            $response  = true;
        } catch (Exception $e) {
            $response = $e->getMessage();
        }

        return new JsonResponse($response);
    }

    /**
     * @throws InstagramAuthException
     * @throws InvalidArgumentException
     * @throws InstagramException
     * @throws GuzzleException
     * @throws InstagramDownloadException
     * @throws RandomException
     */
    #[Route('/api/instagram-feed/{forced}/{apiKey}', name: 'api_instagram_feed', defaults: ['forced' => null, 'apiKey' => null])]
    public function instagramFeed(?string $forced, ?string $apiKey): JsonResponse|string
    {

        if (!is_dir('../public/instagram')) {
            mkdir('../public/instagram');
        }

        $cachePool = new FilesystemAdapter('Instagram', 0, __DIR__ . '/../cache');

        $cache = new FilesystemAdapter();
        $key = 'last_request_time';
        $dataKey = 'data_key';
        $lastRequestTime = $cache->getItem($key)->get();
        $instagramMedia = [];

        $folderItems = scandir('../public/instagram');
        $itemsInFolder = array_diff($folderItems, ['.', '..']);
        $numberOfFiles = count($itemsInFolder);

        $instagramFeedApiKey = $this->getParameter('instagram_feed_api_key');

        if ($apiKey !== null) {
            if ($apiKey !== $instagramFeedApiKey) {
                return new JsonResponse('Invalid API KEY!', 500);
            }
        }

        if ($forced === 'forced' && $apiKey === null) {
            return new JsonResponse('API KEY is missing!', 500);
        }

        if ($numberOfFiles === 0 || ($forced === 'forced' && $apiKey === $instagramFeedApiKey)) {
            $cacheTime = 1;
        } else {
            $cacheTime = 43200 + random_int(7200, 14400);
        }

        if (!$lastRequestTime || (time() - $lastRequestTime) > $cacheTime) {
            $api = new Api($cachePool);
            $userName = $this->getParameter('instagram_user_name');
            $password = $this->getParameter('instagram_password');
            $mainInstagramAccount = $this->getParameter('instagram_main_user_name');
            $api->login($userName, $password);

            try {
                $profile = $api->getProfile($mainInstagramAccount);
            } catch (InstagramException $e) {
                return new JsonResponse($e->getMessage(), 500);
            }

            try {
                $profileMedia = $api->getMoreMedias($profile, 15);
            } catch (InstagramException $e) {
                return new JsonResponse($e->getMessage(), 500);
            }

            /** @var  $oneMedia */
            $newData = [];
            foreach ($profileMedia->getMedias() as $oneMedia) {
                $newData['id'] = $oneMedia->getId();
                $newData['shortCode'] = $oneMedia->getShortCode();
                $newData['caption'] = $oneMedia->getCaption();
                $newData['link'] = $oneMedia->getLink();
                $newData['likes'] = $oneMedia->getLikes();
                $newData['comments'] = $oneMedia->getComments();
                $newData['height'] = $oneMedia->getHeight();
                $newData['width'] = $oneMedia->getWidth();
                $instagramMedia[] = $newData;
            }

            $dataToSave = $cache->getItem($dataKey)->set(serialize($profileMedia->getMedias()));
            $cache->save($dataToSave);
            $cacheTime = $cache->getItem($key)->set(time());
            $cache->save($cacheTime);

            $this->downloadMedias($profileMedia->getMedias());
        } else {
            $instagramDataService = new InstagramDataService();
            $instagramMedia = $instagramDataService->getCachedInstagramData();
        }
        return new JsonResponse($instagramMedia);
    }

    #[Route('/api/instagram-feed-cached', name: 'api_instagram_feed_cached')]
    public function instagramFeedCached(): JsonResponse
    {
        $instagramDataService = new InstagramDataService();
        $instagramMedia = $instagramDataService->getCachedInstagramData();
        if (empty($instagramMedia)) {
            try {
                return $this->instagramFeed(null, null);
            } catch (Exception $e) {
                return new JsonResponse($e->getMessage(), 500);
            }
        }
        return new JsonResponse($instagramMedia);
    }


    /**
     * @throws InvalidArgumentException
     */
    #[Route('/api/instagram-check', name: 'api_instagram_check')]
    public function instagramCheck(): JsonResponse
    {
        $cache = new FilesystemAdapter();
        $key = 'last_request_time';
        $lastRequestTime = $cache->getItem($key)->get();
        if ($lastRequestTime !== null) {
            $localDateTime = date('d. m. Y H:i:s', $lastRequestTime);
            return new JsonResponse(['last:' => $localDateTime]);
        }
        return new JsonResponse(['last:' => 'never']);
    }

    /**
     * @throws InstagramDownloadException
     */
    public function downloadMedias(array $medias): void
    {
//        $files = glob('../public/instagram/*');
//        foreach($files as $file){
//            if(is_file($file))
//                unlink($file);
//        }

        /** @var Media $media */
        foreach ($medias as $media) {
            $this->downloadMedia($media->getDisplaySrc(), $media->getShortCode(), '../public/instagram');
        }
    }

    /**
     * @throws InstagramDownloadException
     */
    public static function downloadMedia(string $url, string $id, string $folder = __DIR__ . '/../../../assets'): string
    {
        if(!filter_var($url, FILTER_VALIDATE_URL)) {
            throw new InstagramDownloadException('Media url is not valid');
        }

        $fileName = $id . '.jpg';
        $content = file_get_contents($url);
        file_put_contents($folder . '/' . $fileName, $content);

        return $fileName;
    }

}
