<template>
  <div id="app">
    <section>
      <h1 class="subtitle" v-if="events==null">Sorry, you must complete a workout first!</h1>
      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Completed Workouts</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
        <b-datepicker v-if="events!=null" v-model="selectedDate" inline :events="events" indicators="dots"></b-datepicker>

        </div>
      </b-collapse>
    </section>
    <ul v-if="selectedDateEvents!=null">
      <li
        v-for="workout in selectedDateEvents"
        :key="workout.workoutRef.id"
      >
        <SingleWorkout
          v-on:delete-workout="deleteWorkout"
          v-bind:workout="workout.workoutRef"
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
    return {
      selectedDate: new Date(),
      completedWorkouts: this.$store.state.a.completedWorkouts,
    };
  },
  async mounted() {
    //get the completed workouts from firebase
    const db = firebase.firestore();
    let dbHistory = await db
      .collection("users")
      .doc(this.$store.state.b.user.data.uID)
      .get();

    //store the results in the vuex store
    this.$store.commit("setCompletedWorkouts", dbHistory.data().completedWorkouts, {
      root: true,
    });
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
      this.completedWorkouts=this.$store.state.a.completedWorkouts;
      this.$buefy.toast.open({ message: 'Deleted!', type: 'is-danger' });
    },
  },
  computed: {
    events() {
      if(this.completedWorkouts==null)
        return null;


      //stores the return array
      let returnVal=[];
      //object with all name-color pairs
      let names={};
      //array with all possible colors, will get removed gradually as individual colors are assigned
      let possibleColors=["is-primary", "is-danger", "is-warning", "is-info", "is-success"];
      //array containing name-color pairs (its the same as names just easier to search)
      let colorTable=[];
      for(let workout of this.completedWorkouts){
        let workoutName=workout.workoutTemplate.name;
        let finalColor= "is-primary";
        // if names doesnt have this name's color already figured get in the if statement
        if(!Object.keys(names).includes(workoutName) && possibleColors.length>0){
          const randomIndex=Math.floor(Math.random() * possibleColors.length);
          const randomColor = possibleColors[randomIndex];
          const colorTableObj= {name: workoutName, color: randomColor};
          //assign this name to the random color in the names table
          names[workoutName]=randomColor;
          //remove the color from the possible colors to choose from in the future
          possibleColors.splice(randomIndex,1);
          //add the name-color combo to an array
          colorTable.push(colorTableObj);
          //assign final color
          finalColor= randomColor;
        }else {
          //search the colortable array for the first elemtn that has the same name, then copy its color
          finalColor= colorTable.find(x => x.name == workoutName).color;
        }
        const workoutDate = new Date(workout.date.toDate());
        let singleEvent={date: workoutDate, type: finalColor, workoutRef: workout}
        returnVal.push(singleEvent);
      }
      return returnVal;
    },

    selectedDateEvents() {
      if(this.completedWorkouts==null)
        return null;
      return this.events.filter((elt)=>datesAreOnSameDay(elt.date,this.selectedDate));
    }
  }
};

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
</script>

<style scoped>
.subtitle {
  margin: 15px;
  margin-bottom: 0px;
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
section {
  padding: 16px;
  padding-bottom: 0px;
}
.button {
  margin: 10px;
}
</style>
