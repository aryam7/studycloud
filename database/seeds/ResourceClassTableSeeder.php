<?php

use App\Resource;
use App\Academic_Class;
use Illuminate\Database\Seeder;
use App\Repositories\ClassRepository;
use App\Repositories\ResourceRepository;

class ResourceClassTableSeeder extends Seeder
{
	/**
	 * What is the maximum number of resources that each class can have?
	 */
	const NUM_MAX_RESOURCES = 3;

	/**
	 * With what probability should resources be assigned to classes farther down the tree than those closer to the root?
	 * Use 1 if you want resource-class attachments to be weighted by depth and 0 otherwise.
	 */
	const WEIGHT = 1;

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		// big picture: iterate through each resource and pick a class for them from the allowed classes
		// since we want every resource to have at least one class
		
		// get the allowed classes
		$classes = Academic_Class::all();
		$depths = collect(ClassRepository::depths($classes, 1));

		Resource::all()->shuffle()->each(
			function($resource) use ($classes, $depths)
			{
				$available_classes = ResourceRepository::allowedClasses($resource);
				$class = null;
				// pick a class if one exists
				while (is_null($class) && $classes->count() > 0)
				{
					$class = $this->pickRandomClass($classes, $available_classes, $depths);
					// if this class already has too many resources
					if ($class->resources()->count() >= self::NUM_MAX_RESOURCES)
					{
						$classes->forget($classes->search($class));
						$class = null;
					}
				}
				if (!is_null($class))
				{
					// add this resource to the class
					$resource->class()->associate($class)->save();
				}
			}
		);
	}

	private function pickRandomClass($classes, $available_classes, $depths)
	{
		$classes = $classes->intersect($available_classes)->keyBy('id');
		$depths = $depths->intersectByKeys($classes);
		return $classes->get(wrand($depths, self::WEIGHT));
	}
}
