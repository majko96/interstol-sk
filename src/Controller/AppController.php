<?php

namespace App\Controller;

use App\Entity\Review;
use App\Service\GoogleReviewsService;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Client;
use SplFileInfo;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Annotation\Route;
use Twig\Environment;

class AppController extends BaseController
{
    protected Environment $twig;
    protected ParameterBagInterface $parameters;
    private EntityManagerInterface $entityManager;

    public function __construct(
        Environment $twig,
        ParameterBagInterface $parameters,
        EntityManagerInterface $entityManager,
    ) {
        parent::__construct($twig, $parameters);
        $this->entityManager = $entityManager;
    }
    #[Route('/', name: 'app_home_page')]
    public function index(): Response
    {
//        $reviewRepository = $this->entityManager->getRepository(Review::class);
//
//        $reviews = $reviewRepository->findAll();
//        $reviewArray = [];
//        foreach ($reviews as $review) {
//            $reviewArray[] = [
//                'id' => $review->getId(),
//                'name' => $review->getName(),
//                'value' => $review->getValue(),
//                'text' => $review->getText(),
//            ];
//        }
        return $this->render('App/HomePage.html.twig', [
            'instagram_account' => $this->getParameter('instagram_main_user_name'),
            'place_id' => $this->getParameter('google_place_id'),
//            'references' => $reviewArray,
        ]);
    }

    #[Route('/nase-sluzby', name: 'app_services')]
    public function services(): Response
    {
        return $this->render('App/Services.html.twig');
    }

    #[Route('/vyroba-nabytku/kuchyne-na-mieru', name: 'app_services_kitchen')]
    public function servicesKitchen(): Response
    {
        return $this->render('App/ServicesKitchen.html.twig');
    }

    #[Route('/vyroba-nabytku/kupelnovy-nabytok', name: 'app_services_bathroom')]
    public function servicesBathroom(): Response
    {
        return $this->render('App/ServicesBathroom.html.twig');
    }

    #[Route('/vyroba-nabytku/vstavane-skrine', name: 'app_services_bedroom')]
    public function servicesBedroom(): Response
    {
        return $this->render('App/ServicesBedroom.html.twig');
    }

    #[Route('/vyroba-nabytku/atypicky-nabytok', name: 'app_services_atypical')]
    public function servicesAtypical(): Response
    {
        return $this->render('App/ServicesAtypical.html.twig');
    }

    #[Route('/materialy', name: 'app_materials')]
    public function materials(): Response
    {
        return $this->render('App/Materials.html.twig');
    }

    #[Route('/kovania', name: 'app_fittings')]
    public function fittings(): Response
    {
        return $this->render('App/Fittings.html.twig');
    }

    #[Route('/kontakt', name: 'app_contact')]
    public function contact(): Response
    {
        return $this->render('App/Contact.html.twig');
    }

    #[Route('/recenzie', name: 'app_reviews')]
    public function reviews(): Response
    {
        $googlePlaceId = $this->getParameter('google_place_id');
        $googleReviewsService = new GoogleReviewsService(
            $googlePlaceId,
            $this->getParameter('google_api_key')
        );

        $reviews = $googleReviewsService->getReviews();
        return $this->render('App/Reviews.html.twig', compact('reviews', 'googlePlaceId'));
    }

    #[Route('/realizacie', name: 'app_photos')]
    public function photoGallery(): Response
    {
        $baseDir = $this->getParameter('kernel.project_dir') . '/public/images';

        $folderConfig = [
            '1' => ['title' => 'Kuchyne',    'order' => 1],
            '2' => ['title' => 'Kúpeľňový nábytok',    'order' => 5],
            '3' => ['title' => 'Obývačky',   'order' => 4],
            '4' => ['title' => 'Schodiská',   'order' => 3],
            '5' => ['title' => 'Vstavané skrine',   'order' => 6],
            '8' => ['title' => 'Spálne',   'order' => 2],
            '9' => ['title' => 'Ostatné',   'order' => 7],
        ];

        $allDirs = array_filter(glob($baseDir . '/*'), 'is_dir');

        $orderStart = count($folderConfig) + 1;
        foreach ($allDirs as $dirPath) {
            $folderName = basename($dirPath);
            if (!isset($folderConfig[$folderName])) {
                $folderConfig[$folderName] = [
                    'title' => $folderName,
                    'order' => $orderStart++,
                ];
            }
        }

        uasort($folderConfig, fn($a, $b) => $a['order'] <=> $b['order']);

        $galleries = [];

        foreach ($folderConfig as $folder => $config) {
            $dirPath = $baseDir . '/' . $folder;

            if (!is_dir($dirPath)) {
                continue;
            }

            $finder = new Finder();
            $finder->files()
                ->in($dirPath)
                ->name('/\.(jpe?g|png|gif|webp)$/i');

            $files = iterator_to_array($finder);
            usort($files, function (SplFileInfo $a, SplFileInfo $b) {
                return $b->getMTime() <=> $a->getMTime();
            });

            $images = [];

            foreach ($files as $file) {
                $relativePath = str_replace($baseDir, '', $file->getRealPath());
                $images[] = '/images' . $relativePath;
            }

            if (!empty($images)) {
                $galleries[] = [
                    'name' => $config['title'],
                    'images' => $images,
                ];
            }
        }

        return $this->render('App/PhotoGallery.html.twig', compact('galleries'));
    }

    #[Route('/clear-cache', name: 'clear_cache')]
    public function clearCache(KernelInterface $kernel): Response
    {
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput([
            'command' => 'cache:clear',
            '--no-warmup' => true,
        ]);
        $output = new BufferedOutput();

        $application->run($input, $output);

        return new Response('<pre>' . $output->fetch() . '</pre>');
    }

}
