<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * IndexController
 *
 * @author Pascal Vervest <pascal@prezent.nl>
 */
class IndexController extends AbstractController
{
    /**
     * @Route("/", name="app_index_index")
     */
    public function index()
    {
        return $this->render('index/index.html.twig', []);
    }
}
