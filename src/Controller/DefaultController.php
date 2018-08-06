<?php

declare(strict_types=1);

namespace App\Controller;

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
     * @Route("/", name="app_default_index")
     */
    public function index()
    {
        return $this->render('index/index.html.twig', []);
    }
}
