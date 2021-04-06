<template>
  <div id="app">
    <b-tabs v-model="activeTab" position="is-centered">
      <b-tab-item
        v-for="workout in this.$store.state.b.workouts"
        :label="workout.name"
        :key="workout.name"
      >
        <ul>
          <li v-for="exercise in workout.exercises" :key="exercise.id">
            <SingleExercise
              v-on:new-data="updateCurrentValues"
              v-bind:exercise-name="exercise.name"
              v-bind:exercise-description="exercise.description"
              v-bind:exercise-id="exercise.id"
              v-bind:goal-exercise-reps="exercise.reps"
              v-bind:goal-exercise-time="exercise.time"
              v-bind:goal-exercise-bpm="exercise.bpm"
              v-bind:goal-exercise-rest="exercise.rest"
              v-bind:goal-exercise-type="exercise.type"
            >
            </SingleExercise>
          </li>
          <b-collapse
            class="card"
            animation="slide"
            aria-id="contentIdForA11y3"
          >
            <template #trigger="props">
              <div
                class="card-header"
                role="button"
                aria-controls="contentIdForA11y3"
              >
                <p class="card-header-title">Rate your Day</p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
                  </b-icon>
                </a>
              </div>
            </template>
            <div class="card-content">
              <b-field>
                <b-slider
                  class="dayrating"
                  v-model="dayRating"
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
      </b-tab-item>
    </b-tabs>

    <div class="box">
      <b-button type="is-primary" v-on:click="markComplete" expanded
        >Mark as Complete</b-button
      >
    </div>
    <div class="footer">
      <div>
        <b-button type="is-success" v-on:click="startTimer">Start</b-button>
      </div>
      <div>
        <b-button type="is-danger" v-on:click="pauseTimer">Pause</b-button>
      </div>
      <div>
        <b-button type="is-warning " v-on:click="resetTimer">Reset</b-button>
      </div>
      <div>
        <b-button class="timer">{{ timerLeft }}</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import SingleExercise from "./SingleExercise.vue";
import store from "../main.js";
export default {
  name: "Workout",
  store: store,
  components: {
    SingleExercise,
  },
  data() {
    return {
      timerIntervals: [],
      activeTab: 0,
      currentTimes: [],
      originalTimes: [],
      currentValues: {},
      dayRating: null,
    };
  },
  created() {
    for (let workout of this.$store.state.b.workouts) {
      this.currentTimes.push(workout.duration);
      this.originalTimes.push(workout.duration);
    }
  },
  computed: {
    timerLeft() {
      let timeLeft = this.currentTime;

      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    },
    currentTime: {
      get: function () {
        return this.currentTimes[this.activeTab];
      },
      set: function (newValue) {
        //next line does this: this.currentTimes[this.activeTab] = newValue;
        this.$set(this.currentTimes, this.activeTab, newValue);
      },
    },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    startTimer() {
      if (this.paused == false) return;
      else {
        this.timerIntervals[this.activeTab] = setInterval(() => {
          this.currentTime -= 1;
          this.currentTime = Math.max(this.currentTime, 0);
        }, 1000);
        this.paused = false;
      }
    },
    updateCurrentValues(exerciseName, property, val) {
      if (this.currentValues[exerciseName] == null) {
        this.currentValues[exerciseName] = {};
      }
      this.currentValues[exerciseName][property] = val;
    },
    pauseTimer() {
      this.paused = true;
      clearInterval(this.timerIntervals[this.activeTab]);
    },
    resetTimer() {
      clearInterval(this.timerIntervals[this.activeTab]);
      this.currentTime = this.originalTimes[this.activeTab];
    },
    async markComplete() {
      const db = firebase.firestore();

      let workout = this.$store.state.b.workouts[this.activeTab];
      let completeWorkout = {
        workoutTemplate: workout,
        date: new Date(),
        data: this.currentValues,
        rating: this.dayRating,
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
      arrayData.push(completeWorkout);
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
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.footer {
  border-top: 1px solid rgba(95, 95, 95, 0.8);
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
</style>
