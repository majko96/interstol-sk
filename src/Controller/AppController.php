<?php

namespace App\Controller;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Twig\Environment;

class AppController extends AbstractController
{
    private Environment $twig;
    private ParameterBagInterface $parameters;

    public function __construct(
        Environment $twig,
        ParameterBagInterface $parameters
    ) {
        $this->twig = $twig;
        $this->parameters = $parameters;
        $this->twig->addGlobal(
            'instagramAccount',
            $this->parameters->get('instagram_main_user_name')
        );
    }
    #[Route('/', name: 'app_home_page')]
    public function index(): Response
    {
        return $this->render('App/HomePage.html.twig', [
            'instagram_account' => $this->getParameter('instagram_main_user_name')
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
}
