<?php

namespace App\Services;

use App\Models\Like;
use Illuminate\Support\Facades\Redis;

class LikeService
{

    public function createLike(string $userId, string $postId): Like | null
    {
        $like = Like::query()
            ->where("user_id", $userId)
            ->where("post_id", $postId)
            ->first();

        if ($like != null) {
            return null;
        }

        // Increment like count for this post.
        Redis::incr($this->getLikeCountCacheKey($postId));
        $like = Like::create([
            "user_id" => $userId,
            "post_id" => $postId,
        ]);

        // User now likes this post.
        Redis::setex($this->getLikeUsersCacheKey($postId, $userId), 3600, $like->id);
        return $like;
    }

    public function getLikeCount(string $postId): int
    {
        $cacheKey = $this->getLikeCountCacheKey($postId);
        $cached = Redis::get($cacheKey);
        if ($cached != null) {
            return $cached;
        }

        // Fetch actual like count, and cache it.
        $likeCount = Like::where("post_id", $postId)->count();
        Redis::setex($cacheKey, 3600, $likeCount);

        return $likeCount;
    }

    public function userLikesPost(string $userId, string $postId): string | null
    {
        $cacheKey = $this->getLikeUsersCacheKey($postId, $userId);
        $cached = Redis::get($cacheKey);
        if ($cached != null) {
            return $cached == "null" ? null : $cached;
        }

        // Fetch if user likes post and cache it.
        $like = Like::where("post_id", $postId)
            ->where("user_id", $userId)
            ->first();

        $likeId = $like != null ? $like->id : null;
        Redis::setex($cacheKey, 3600, $likeId != null ? $likeId : "null");

        return $likeId;
    }

    public function deleteLike(string $userId, string $likeId): bool
    {
        $like = Like::query()
            ->where("user_id", $userId)
            ->where("id", $likeId)
            ->first();

        if ($like == null) {
            return false;
        }

        $like->delete();
        Redis::setex($this->getLikeUsersCacheKey($like->post_id, $userId), 3600, "null");
        Redis::decr($this->getLikeCountCacheKey($like->post_id));
        return true;
    }

    private function getLikeCountCacheKey(string $postId): string
    {
        return "like_count:$postId";
    }

    /**
     * Redis cache key for if a user likes a post.
     */
    private function getLikeUsersCacheKey(string $postId, string $userId): string
    {
        return "like_users:$postId:$userId";
    }
}
