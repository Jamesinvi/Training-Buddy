<template>
  <div id="app">
    <ul>
      <li
        v-for="(exercise, index) in Object.keys(workout.data)
          .filter((key) => !/Rest */.test(key))
          .reduce((acc, key) => {
            acc[key] = workout.data[key];
            return acc;
          }, {})"
        :key="exercise.uid"
      >
        <SingleExerciseModify
          v-on:new-data="updateCurrentValues"
          v-bind:exercise-name="index"
          v-bind:actual-exercise-reps="exercise.reps ? exercise.reps : 1"
          v-bind:actual-exercise-weight="exercise.weight ? exercise.weight : 0"
          v-bind:actual-exercise-type="exercise.type ? exercise.type : 'full'"
          v-bind:timestampObj="exercise.timestamp"
        >
        </SingleExerciseModify>
      </li>
      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Rate your Day</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>
        <div class="card-content">
          <b-field>
            <b-slider
              class="dayrating"
              v-model="workout.rating"
              :min="1"
              :max="5"
              :tooltip="false"
            >
              <b-slider-tick :value="1">1</b-slider-tick>
              <b-slider-tick :value="2">2</b-slider-tick>
              <b-slider-tick :value="3">3</b-slider-tick>
              <b-slider-tick :value="4">4</b-slider-tick>
              <b-slider-tick :value="5">5</b-slider-tick>
            </b-slider>
          </b-field>
        </div>
      </b-collapse>
    </ul>

    <div class="box">
      <b-button type="is-primary" v-on:click="updateDatabase" expanded
        >Update</b-button
      >
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import SingleExerciseModify from "./SingleExerciseModify.vue";
import store from "../main.js";
export default {
  name: "Workout",
  store: store,
  components: {
    SingleExerciseModify,
  },
  data() {
    return {
      currentValues: {},
      showAddExerciseModal: false,
    };
  },
  computed: {
    workout() {
      return this.$store.state.a.completedWorkouts.filter(
        (item) => item.id == this.$route.params.id
      )[0];
    },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    showModal() {
      this.showAddExerciseModal = !this.showAddExerciseModal;
    },
    updateCurrentValues(exerciseName, property, val) {
      if (this.currentValues[exerciseName] == null) {
        this.currentValues[exerciseName] = {};
      }
      this.currentValues[exerciseName][property] = val;
    },
    async updateDatabase() {
      const db = firebase.firestore();
      let workout = this.workout;

      //newWorkoutData is now the union of obj1 and obj2. Properties in obj2 will overwrite those in obj1.
      const newWorkoutData = { ...workout.data, ...this.currentValues };
      let completeWorkout = {
        workoutTemplate: workout.workoutTemplate,
        date: workout.date,
        data: newWorkoutData,
        rating: workout.rating,
        id: workout.id,
      };
      let doc = await db
        .collection("users")
        .doc(this.$store.state.b.user.data.uID)
        .get();

      let arrayData;
      if (doc.data().completedWorkouts == null) {
        arrayData = [];
      } else {
        arrayData = doc.data().completedWorkouts;
      }
      //find index of the corresponding workout in the database
      let index = arrayData.findIndex((item) => item.id == workout.id);
      //assign that element of the array to the new MODIFIED version
      arrayData[index] = completeWorkout;
      await db
        .collection("users")
        .doc(this.$store.state.b.user.data.uID)
        .update({ completedWorkouts: arrayData });
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
      this.goBack();
    },
  },
};
</script>

<style scoped>
.footer {
  border: 1px solid rgba(95, 95, 95, 0.8);
  box-shadow: 0px 0 9px rgba(173, 173, 173, 0.8);
  -webkit-position: sticky;
  z-index: 100;
  position: sticky;
  background: white;
  display: flex;
  justify-content: space-evenly;
  bottom: 0;
  height: 70px;
  width: 100%;
  padding: 15px;
}
.card {
  box-shadow: 0px 0 9px rgba(119, 119, 119, 0.8);
}
.card-content {
  padding: 5px;
}
.header {
  font-weight: bold;
}
.dayrating {
  width: 90%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.right {
  float: right;
  margin-right: 15px;
  margin-bottom: 15px;
}
.box {
  padding: 5px;
  margin: 10px;
  box-shadow: none;
  border: none;
}
.dynamic-grid {
  display: grid;
  gap: 0.3rem;
}
.grid-item {
  padding: 1px;
}
</style>
