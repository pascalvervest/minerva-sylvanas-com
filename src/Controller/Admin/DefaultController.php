<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * DefaultController
 *
 * @author Pascal Vervest <pascal@prezent.nl>
 */
class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="app_admin_index")
     */
    public function index()
    {
        return $this->render('admin/default/index.html.twig', []);
    }
}
