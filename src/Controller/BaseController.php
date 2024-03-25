<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Twig\Environment;

class BaseController extends AbstractController
{
    protected Environment $twig;
    protected ParameterBagInterface $parameters;

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
}