<?php
namespace App\Controller\Admin;

use AllowDynamicProperties;
use App\Controller\BaseController;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Twig\Environment;

#[AllowDynamicProperties] class SecurityController extends BaseController
{
    public function __construct(
        Environment $twig,
        ParameterBagInterface $parameters
    ) {
        parent::__construct($twig, $parameters);
    }

    /**
     * @Route("/login", name="app_login")
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('Security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    /**
     * @Route("/logout", name="app_logout")
     * @throws Exception
     */
    public function logout()
    {
        throw new Exception('This method can be intercepted by the logout key on your firewall.');
    }
}