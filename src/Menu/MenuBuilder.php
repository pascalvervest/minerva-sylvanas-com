<?php

declare(strict_types=1);

namespace App\Menu;

use Knp\Menu\FactoryInterface;

/**
 * Contains all menus
 *
 * @author Pascal Vervest <pascal@prezent.nl>
 */
class MenuBuilder
{
    /**
     * @var FactoryInterface
     */
    private $factory;

    /**
     * MenuBuilder constructor.
     */
    public function __construct(FactoryInterface $factory)
    {
        $this->factory = $factory;
    }

    /**
     * Main menu
     */
    public function createMainMenu(array $options)
    {
        $menu = $this->factory->createItem('root', [
            'childrenAttributes'=> [
                'class' => 'menu align-center',
            ]
        ]);

        $menu->addChild('Home', ['route' => 'app_index_index']);
        $menu->addChild('Blogs', ['route' => 'app_index_index']);
        $menu->addChild('Guild', ['route' => 'app_index_index']);
        $menu->addChild('Recruits', ['route' => 'app_index_index']);
        $menu->addChild('Progress', ['route' => 'app_index_index']);
        $menu->addChild('Streams', ['route' => 'app_index_index']);

        return $menu;
    }
}
