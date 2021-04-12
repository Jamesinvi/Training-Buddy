<template>
  <section>
    <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3"
        >
          <p class="card-header-title">{{ name }}</p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
          </a>
        </div>
      </template>

      <div class="card-content">
        <p>Timestamp: {{ completionDate }}</p>
        <p>Day rating: {{ dayRating }} / 5</p>

        <b-button type="is-info">Show</b-button>
        <b-button
          v-on:click="deleteWorkout"
          type="is-danger"
          icon-left="delete"
        >
          Delete
        </b-button>
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
    workout: Object,
  },
  data() {
    return {
      name: this.$props.workout.workoutTemplate.name,
      dayRating: this.$props.workout.rating,
      id: this.$props.workout.id,
    };
  },
  computed: {
    completionDate: function () {
      let convertedTimestamp = new Date(
        this.$props.workout.date.seconds * 1000
      );
      return convertedTimestamp.toLocaleString();
    },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    deleteWorkout() {
      this.$emit("delete-workout", this.id);
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
  grid-template-columns: auto auto auto;
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
.button {
  margin: 10px;
}
</style>
