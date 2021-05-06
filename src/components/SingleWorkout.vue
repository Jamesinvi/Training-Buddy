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
          @click="confirm"
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
    confirm() {
      this.$buefy.dialog.confirm({
          title: 'Deleting workout',
          message: 'Are you sure you want to <b>delete</b> this workout? This action cannot be undone.',
          confirmText: 'Delete Workout',
          type: 'is-danger',
          onConfirm: () => this.deleteWorkout()
      })
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
.header {
  font-weight: bold;
}
section {
  padding: 16px;
}
.button {
  margin: 10px;
}
</style>
