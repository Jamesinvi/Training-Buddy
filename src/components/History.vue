<template>
  <div id="app">
    <h1 class="subtitle">Completed Workouts</h1>
    <ul>
      <li
        v-for="workout in this.$store.state.a.completedWorkouts"
        :key="workout.id"
      >
        <SingleWorkout
          v-on:delete-workout="deleteWorkout"
          v-bind:workout="workout"
        ></SingleWorkout>
      </li>
    </ul>
  </div>
</template>

<script>
import store from "../main.js";
import firebase from "firebase/app";
import "firebase/auth";
import SingleWorkout from "./SingleWorkout.vue";

export default {
  name: "History",
  store: store,
  components: { SingleWorkout },
  data() {
    return {};
  },
  methods: {
    async deleteWorkout(id) {
      const db = firebase.firestore();
      //get the completed workouts from db
      let oldArray = await db
        .collection("users")
        .doc(this.$store.state.b.user.data.uID)
        .get();
      //create new array without the one we want to delete
      let newArray = oldArray.data().completedWorkouts.filter((value) => {
        return value.id != id;
      });
      //push it back to the db with the new values
      await db
        .collection("users")
        .doc(this.$store.state.b.user.data.uID)
        .update({ completedWorkouts: newArray });
      //get it back from database instead of adding it directly to the store, this is to fix the timestamp~!
      let newData = await db
        .collection("users")
        .doc(this.$store.state.b.user.data.uID)
        .get();
      this.$store.commit(
        "setCompletedWorkouts",
        newData.data().completedWorkouts,
        { root: true }
      );
    },
  },
};
</script>

<style scoped>
.subtitle {
  margin: 15px;
  margin-bottom: 0px;
}
</style>
