<template>
  <div class="user-playlist">
    <h3>My Playlists</h3>
    <div class="error" v-if="error">Could not fetch the data</div>
    <div v-if="playlists">
      <ListView :playlists="playlists" />
    </div>
    <router-link class="btn" :to="{ name: 'CreatePlaylist' }"
      >Create a New Playlist</router-link
    >
  </div>
</template>

<script>
import getUser from "@/composables/getUser";
import getCollection from "@/composables/getCollection";
import ListView from "@/components/ListView.vue";

export default {
  components: { ListView },
  setup() {
    const { user } = getUser();
    const { error, documents: playlists } = getCollection(
      "playlists",
      user.value.uid
    );
    return { error, playlists };
  },
};
</script>

<style>
</style>