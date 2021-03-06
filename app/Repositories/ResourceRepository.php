<?php

namespace App\Repositories;

use App\Topic;
use App\Resource;
use App\Academic_Class;
use App\Helpers\NodesAndConnections;
use App\Repositories\ClassRepository;
use App\Repositories\TopicRepository;
use Illuminate\Database\Eloquent\Collection;

class ResourceRepository
{
	/**
	 * In a single query, get the resources of all of the topics in a collection of topic ids.
	 * @param  array 	$topic_ids 	the topic ids of the resources you want returned
	 * @param bool		$with_pivot	whether to also load a pivot attribute on each resource
	 * @return Collection         	the resources as Collections
	 */
	public static function getByTopics($topic_ids, $with_pivot=true)
	{
		// if we need to load a pivot attribute, we'll need two queries
		if ($with_pivot)
		{
			// executes two queries
			return Topic::whereIn('id', $topic_ids)->with('resources')->get()
			->pluck('resources')->collapse()->map(
				function ($resource)
				{
					// return the resource as a collection
					return collect($resource);
				}
			);
		}
		else
		{
			// executes only a single query!
			return Resource::whereHas('topics',
				function($query) use ($topic_ids)
				{
					$query->whereIn('id', $topic_ids);
				}
			)->get()->map(
				function ($resource)
				{
					// return the resource as a collection
					return collect($resource);
				}
			);
		}
	}

	/**
	 * In a single query, get the resources of all of the classes in a collection of class ids.
	 * @param  array 	$class_ids 	the class ids of the resources you want returned
	 * @param bool		$with_pivot	whether to also load a pivot attribute on each resource
	 * @return Collection         	the resources as Collections
	 */
	public static function getByClasses($class_ids, $with_pivot=true)
	{
		// executes only a single query!
		return Resource::whereHas('class',
			function($query) use ($class_ids)
			{
				$query->whereIn('id', $class_ids);
			}
		)->get()->map(
			function ($resource) use ($with_pivot)
			{
				// return the resource as a collection
				$resource = collect($resource);
				// if we need to include the class relationship as a pivot, add it manually
				if ($with_pivot)
				{
					$resource->put('pivot', [
						'resource_id' => $resource['id'],
						'class_id' => $resource->pull('class_id')
					]);
				}
				return $resource;
			}
		);
	}

	/**
	 * a wrapper function for attaching topics that prevents disallowed topics
	 * from being added
	 * @param  Resource 	$resource 	the resource to attach topics to
	 * @param  Collection 	$new_topics the topics to be attached
	 * @return 
	 */
	public static function attachTopics($resource, $new_topics)
	{
		// get the ids of the topics that we can't attach
		$disallowed_topics = self::disallowedTopics($resource)->pluck('id');
		// iterate through each topic that we want to attach and make sure it can be added
		foreach ($new_topics as $topic) {
			if ($disallowed_topics->contains($topic->id))
			{
				throw new \Exception("One of the desired topics cannot be attached because it is an ancestor or descendant of one of this resource's current topics. You can use the disallowedTopics() method to see which topics cannot be attached to this resource.");
				return;
			}
		}
		return $resource->topics()->attach($new_topics);
	}

	/**
	 * a wrapper function for attaching a class. it will override the currently attached class
	 * @param  Resource 	$resource 		the resource to attach the class to
	 * @param  Academic_Class|int|string 	$new_class the class to be attached
	 * @return 
	 */
	public static function attachClass($resource, $new_class)
	{
		// get the ids of the classes that we can attach
		$allowed_classes = self::allowedClasses($resource)->pluck('id');
		$new_class = is_a($new_class, Academic_Class::class) ? $new_class->id : $new_class;
		if (!$allowed_classes->contains($new_class))
		{
			throw new \Exception("One of the desired classes cannot be attached because it is an ancestor or descendant of one of this resource's current classes. You can use the allowedClasses() method to see which classes can be attached to this resource.");
			return;
		}
		return $resource->class()->associate($new_class)->save();
	}

	/**
	 * Moves the resource into the desired topic $new_topic. If attempting to 
	 * move into a topic that is an ancestor or child of the resource's
	 * current topics, the current topic will be replaced by the new_topic.
	 * @param Topic 	$new_topic	the topic which we want to add to $resource
	 * @param Resource	$resource	the resource to move
	 */
	public static function addTopic(Topic $new_topic, Resource $resource)
	{
		// get the set of disallowed topics for this resource
		$disallowed_topics = self::disallowedTopics($resource);
		// check whether $new_topic is one of the disallowed topics
		if ($disallowed_topics->contains('id', $new_topic->id))
		{
			// remove any current topics that are preventing $new_topic from
			// being added. no incest!
			$this->removeFamily($resource, $new_topic->id, $disallowed_topics);
		}
		// safely add $new_topic to $resource
		// in the future, you might want to change this to be a regular attach
		// (so that the function becomes faster)
		self::attachTopics($resource, collect([$new_topic]));
	}

	/**
	 * remove any ancestor or descendant topics that conflict
	 * with the topic that we want to add a resource to
	 * @param  Resource 	$resource 			the resource with potential topic conflicts
	 * @param  Collection 	$new_topic_id 		the topic we want to add this resource to
	 * @param  Collection 	$disallowed_topics 	a collection of topics that can't be added to our resource
	 */
	private function removeFamily($resource, $new_topic_id, $disallowed_topics)
	{
		$old_topics = collect();
		// convert $disallowed_topics to a collection of connections
		$disallowed_topics = NodesAndConnections::treeAsConnections($disallowed_topics);
		// which topics is this resource currently in?
		$topics = $resource->topics()->get();
		// iterate through the current topics and determine whether they conflict with the new topic
		foreach ($topics as $topic) {
			if (TopicRepository::isAncestor($topic->id, $new_topic_id, $disallowed_topics)
				|| TopicRepository::isDescendant($topic->id, $new_topic_id, $disallowed_topics))
			{
				// if a current topic conflicts, add it to the list of topics to remove
				// TODO: remove it right away and recalculate $disallowed_topics?
				$old_topics->push($topic->id);
			}
		}
		self::detachTopics($resource, $old_topics);
	}

	/**
	 * a wrapper function for detaching topics for ease of use
	 * @param  Resource 	$resource 	the resource whose topics you'd like to detach
	 * @param  Collection 	$new_topics the topics to detach (as IDs)
	 */
	public static function detachTopics($resource, $old_topics)
	{
		return $resource->topics()->detach($old_topics);
	}

	/**
	 * which topics isn't this resource allowed to be added to?
	 * @param  Resource 	$resource 	the resource whose disallowedTopics you'd like to get
	 * @return Collection
	 */
	public static function disallowedTopics($resource)
	{
		$topics = $resource->topics()->get();
		$disallowed_topics = $topics->map(
			function ($topic)
			{
				// return the topic as a collection without its pivot attribute
				return collect($topic)->except('pivot');
			}
		);
		foreach ($topics as $topic) {
			// this resource can't be added to the ancestors or descendants of any of the topics it's already in
			// adding to an ancestor is redundant information
			// so the resource must be removed from a topic before the resource can be added to one of that topic's descendants
			$ancestors = (new TopicRepository)->ancestors($topic);
			$descendants = (new TopicRepository)->descendants($topic);
			$disallowed_topics = $disallowed_topics->merge($ancestors)->merge($descendants);
		}
		return $disallowed_topics;
	}

	/**
	 * which topics is this resource allowed to be added to?
	 * Note: this function executes one more query than disallowedTopics() and is therefore a bit slower. don't use it if you don't have to
	 * Note also: the topics returned in this function won't have pivots
	 * @param  Resource 	$resource 	the resource whose allowedTopics you'd like to get
	 * @return Collection
	 */
	public static function allowedTopics($resource)
	{
		return collect(Topic::whereNotIn('id', self::disallowedTopics($resource)->pluck('id'))->get());
	}

	/**
	 * which classes isn't this resource allowed to be added to?
	 * Note: this function executes one more query than allowedClasses() and is therefore a bit slower. don't use it if you don't have to
	 * Note also: the classes returned in this function won't have pivots
	 * @param  Resource 	$resource 	the resource whose disallowedClasses you'd like to get
	 * @return Collection
	 */
	public static function disallowedClasses($resource)
	{
		return collect(Academic_Class::whereNotIn('id', self::allowedClasses($resource)->pluck('id'))->get());
	}

	/**
	 * which classes is this resource allowed to be added to?
	 * @param  Resource|null 	$resource 	the resource whose allowedClasses you'd like to get; may be null if the resource hasn't been created yet
	 * @return Collection
	 */
	public static function allowedClasses($resource)
	{
		// resources can be added to any class that doesn't have a status of 0
		return Academic_Class::where('status', 1)->get();
	}
}