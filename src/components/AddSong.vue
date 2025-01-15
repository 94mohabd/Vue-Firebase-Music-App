<template>
  <div class="add-song">
    <button v-if="!showForm" @click="showForm = true">Add Songs</button>
    <form v-if="showForm" @submit.prevent="handleSubmit">
      <h4>Add a New Song</h4>
      <input type="text" placeholder="Song title" required v-model="title" />
      <input type="text" placeholder="Artist" required v-model="artist" />
      <button>Add</button>
    </form>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import useDocument from "@/composables/useDocument";

export default {
  props: ["playlist"],
  setup(props) {
    const { updateDocument } = useDocument("playlists", props.playlist.id);
    const title = ref("");
    const artist = ref("");
    const showForm = ref(false);

    const handleSubmit = async () => {
      const newSong = {
        title: title.value,
        artist: artist.value,
        id: uuidv4(),
      };
      await updateDocument({
        songs: [...props.playlist.songs, newSong],
      });
      title.value = "";
      artist.value = "";
    };

    return { title, artist, showForm, handleSubmit };
  },
};
</script>

<style scoped>
.add-song {
  text-align: center;
  margin-top: 40px;
}
form {
  max-width: 100%;
  text-align: left;
}
</style>