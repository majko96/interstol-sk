<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;
class SitemapController extends AbstractController
{
    public RouterInterface $router;
    public function __construct(RouterInterface $router) {
        $this->router = $router;
    }

    #[Route('/sitemap.xml', name: 'sitemap')]
    public function index()
    {
        $routes = $this->router->getRouteCollection()->all();
        $appRoutes = [];
        foreach ($routes as $name => $route) {
            if (strpos($name, "app") === 0) {
                $appRoutes[$name] = $route;
            }
        }
        $keys = array_keys($appRoutes);
        $urls = [];
        foreach ($keys as $route) {
            $priority = '0.7';
            $url = $this->router->generate($route, [], UrlGeneratorInterface::ABSOLUTE_URL);
            if ($route === 'app_home_page') {
                $priority = '1.0';
            }
            if ($route === 'app_contact') {
                $priority = '0.9';
            }
            if ($route === 'app_services') {
                $priority = '0.8';
            }
            $urls[] = [
                'loc' => $url,
                'lastmod' => date('Y-m-d'),
                'changefreq' => 'daily',
                'priority' => $priority,
            ];
        }

        $response = new Response(
            $this->renderView('./Sitemap/sitemap.html.twig', ['urls' => $urls]),
            200
        );
        $response->headers->set('Content-Type', 'text/xml');

        return $response;
    }

    #[Route('/robots.txt', name: 'robots_txt')]
    public function robotsTxt()
    {
        $robotsTxt = "User-agent: *\nDisallow: /build/\nDisallow: /api/";

        $response = new Response($robotsTxt, 200);
        $response->headers->set('Content-Type', 'text/plain');

        return $response;
    }
}