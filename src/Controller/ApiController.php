<?php

namespace App\Controller;

use App\Entity\Review;
use App\Service\InstagramDataService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Instagram\Exception\InstagramAuthException;
use Instagram\Exception\InstagramDownloadException;
use Instagram\Exception\InstagramException;
use Instagram\Model\Media;
use Psr\Cache\InvalidArgumentException;
use Random\RandomException;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\Finder\Finder;
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
    private EntityManagerInterface $em;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig,
        EntityManagerInterface $em

    ) {
        $this->twig = $twig;
        $this->mailer = $mailer;
        $this->em = $em;
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

        $review = new Review();
        $review->setName($data->name . ' ' . $data->surname ?? '');
        $review->setValue($data->rating ?? 5);
        $review->setText($data->message ?? '');

        $this->em->persist($review);
        $this->em->flush();

        $response  = ['success' => true];

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
    #[Route('/api/instagram-feed', name: 'api_instagram_feed', defaults: ['forced' => null, 'apiKey' => null])]
    public function instagramFeed(): JsonResponse
    {
        $baseDir = $this->getParameter('kernel.project_dir') . '/public/images';

        $finder = new Finder();
        $finder->files()
            ->in($baseDir)
            ->name('/\.(jpe?g|png|gif|webp)$/i');

        $allImages = iterator_to_array($finder);

        shuffle($allImages);
        $selectedImages = array_slice($allImages, 0, 6);

        $output = [];
        $baseId = 1;
        $count = 0;

        foreach ($selectedImages as $file) {
            $realPath = $file->getRealPath();
            $relativePath = str_replace($baseDir, '', $realPath);
            $urlPath = '/images' . str_replace(DIRECTORY_SEPARATOR, '/', $relativePath);
            $filename = pathinfo($file->getFilename(), PATHINFO_FILENAME);

            [$width, $height] = getimagesize($realPath);

            $output[] = [
                'id' => $baseId + $count,
                'caption' => null,
                'link' => $urlPath,
                'shortCode' => $filename,
                'likes' => 1,
                'comments' => 0,
                'height' => $height,
                'width' => $width,
            ];

            $count++;
        }

        return new JsonResponse($output);
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

    /**
     * @throws InvalidArgumentException
     */
    #[Route('/api/reviews', name: 'api_reviews')]
    public function reviews(): JsonResponse
    {
        $cache = new FilesystemAdapter();
        $client = new Client();
        $cacheKey = 'google_place_reviews_' . $this->getParameter('google_place_id');
        $cacheItem = $cache->getItem($cacheKey);

        if (!$cacheItem->isHit()) {
            $url = 'https://maps.googleapis.com/maps/api/place/details/json';
            $params = [
                'place_id' => $this->getParameter('google_place_id'),
                'key' => $this->getParameter('google_api_key'),
                'fields' => 'reviews',
                'reviews_sort' => 'newest',
                'reviews_no_translations' => true
            ];

            $urlWithParams = $url . '?' . http_build_query($params);

            try {
                $response = $client->request('GET', $urlWithParams);
                $data = json_decode($response->getBody()->getContents(), true);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Error fetching data from Google API'], 500);
            }

            $cacheItem->set($data);
            $cacheItem->expiresAfter(7200);

            $cache->save($cacheItem);
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

        return new JsonResponse($reviews);
    }

}
