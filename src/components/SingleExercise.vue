<template>
  <section>
    <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3"
        >
          <p class="card-header-title">{{ exerciseName }}</p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
          </a>
        </div>
      </template>

      <div class="card-content">
        <div class="grid-container">
          <div class="grid-item header">Category</div>
          <div class="grid-item header">Goal</div>
          <div class="grid-item header">You</div>

          <div class="grid-item header">Reps</div>
          <div class="grid-item">{{ repGoal }}</div>
          <div class="grid-item">
            <b-numberinput
              size="is-small"
              controls-position="compact"
              v-model="reps"
            ></b-numberinput>
          </div>
          <div class="grid-item header">Time</div>
          <div class="grid-item">{{ timeGoal }}</div>
          <div class="grid-item">
            <b-numberinput
              size="is-small"
              controls-position="compact"
              v-model="time"
              step="10"
            ></b-numberinput>
          </div>
          <div class="grid-item header">Rest</div>
          <div class="grid-item">{{ restGoal }}</div>
          <div class="grid-item">
            <b-numberinput
              size="is-small"
              controls-position="compact"
              v-model="rest"
              step="10"
            ></b-numberinput>
          </div>
          <div class="grid-item header">Rythm</div>
          <div class="grid-item">{{ bpmGoal }} BpM</div>
          <div class="grid-item">
            <b-input v-bind:value="computedBpm"></b-input>
          </div>
          <div class="grid-item header">Type</div>
          <div class="grid-item">{{ typeGoal }}</div>
          <div class="grid-item">
            <b-field>
              <b-select v-model="type" placeholder="type">
                <option value="full">Full Reps</option>
                <option value="half">Half Reps</option>
                <option value="quarter">Quarter Reps</option>
              </b-select>
            </b-field>
          </div>
        </div>
      </div>
    </b-collapse>
    <br />
  </section>
</template>

<script>
import store from "../main.js";
export default {
  name: "SingleExercise",
  store: store,
  props: {
    exerciseName: String,
    exerciseDescription: String,
    exerciseId: Number,
    goalExerciseReps: Number,
    goalExerciseTime: Number,
    goalExerciseBpm: Number,
    goalExerciseRest: Number,
    goalExerciseType: String,
    actualExerciseReps: Number,
    actualExerciseRest: Number,
    actualyExerciseType: String,
    actualExerciseTime: Number,
  },
  data() {
    return {
      name: this.$props.exerciseName,
      description: this.$props.exerciseDescription,
      id: this.$props.exerciseId,
      repGoal: this.$props.goalExerciseReps,
      timeGoal: this.$props.goalExerciseTime,
      restGoal: this.$props.goalExerciseRest,
      typeGoal: this.$props.goalExerciseType,
      bpmGoal:
        this.$props.goalExerciseReps / (this.$props.goalExerciseTime / 60),
      reps: this.$props.actualExerciseReps,
      rest: this.$props.actualExerciseRest,
      time: this.$props.actualExerciseTime,
      type: null,
      notes: null,
    };
  },

  methods: {
    completedMessage: function () {
      return this.complete ? "yes" : "no";
    },
    markComplete() {
      this.complete = true;
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
  computed: {
    username() {
      // We will see what `params` is shortly
      return this.$route.params.username;
    },
    complete() {
      console.log(this.$store.a);
      if (!this.$store.getters.getCompletedExercises) return false;
      if (
        this.$store.getters.getCompletedExercises.indexOf(
          this.exerciseId.toString()
        ) >= 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    computedBpm() {
      if (this.reps && this.time) {
        return this.reps / (this.time / 60);
      } else {
        return 0;
      }
    },
  },
  watch: {
    reps: function (newVal) {
      this.$emit("new-data", this.exerciseName, "reps", newVal);
    },
    rest: function (newVal) {
      this.$emit("new-data", this.exerciseName, "rest", newVal);
    },
    time: function (newVal) {
      this.$emit("new-data", this.exerciseName, "time", newVal);
    },
    type: function (newVal) {
      this.$emit("new-data", this.exerciseName, "type", newVal);
    },
    notes: function (newVal) {
      this.$emit("new-data", this.exerciseName, "notes", newVal);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  box-shadow: 0px 0 9px rgba(119, 119, 119, 0.8);
}
.card-content {
  padding: 5px;
}
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
}
.header {
  font-weight: bold;
}
.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(173, 173, 173, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  text-align: center;
}
</style>
