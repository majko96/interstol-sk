<?php

namespace App\Controller\Admin;

use App\Entity\Review;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

class DashboardController extends AbstractDashboardController
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    #[Route('/admin', name: 'admin')]
    public function index(): Response
    {
        $routeBuilder = $this->container->get(AdminUrlGenerator::class);
        $url = $routeBuilder->setController(ReviewController::class)->generateUrl();
        return $this->redirect($url);
    }

    public function configureCrud(): Crud
    {
        $crud = Crud::new();
        return $crud
            ->setSearchFields(null);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Admin - interstol.sk');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToCrud('Reviews', 'fas fa-list', Review::class);
        yield MenuItem::linkToRoute(
            'Instagram - feed',
            'fab fa-instagram',
            'admin_instagram_feed'
        );
    }
}
