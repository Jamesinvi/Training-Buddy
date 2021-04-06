<template>
  <div id="app">
    <h1 class="subtitle">Completed Workouts</h1>
    <ul>
      <li
        v-for="workout in this.$store.state.a.completedWorkouts"
        :key="workout.id"
      >
        <SingleWorkout v-bind:workout="workout"></SingleWorkout>
      </li>
    </ul>
  </div>
</template>

<script>
import store from "../main.js";
import SingleWorkout from "./SingleWorkout.vue";
export default {
  name: "History",
  store: store,
  components: { SingleWorkout },
  data() {
    return {};
  },
};
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.b-tabs {
  background-color: white;
}
.box {
  margin: 0px;
}
</style>
