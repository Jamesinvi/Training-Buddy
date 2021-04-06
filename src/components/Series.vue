<template>
  <div>
    <div id="exercise">
      <div class="row">
        <div class="column-left">
          <p>{{ exerciseName }}</p>
        </div>
        <div class="column-center">
          <label for="reps"> Reps </label>
          <input v-model="reps" type="number" name="reps" /><br /><br />
        </div>
        <div class="column-right">
          <button v-on:click="removeMe">Remove Series</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../main.js";
export default {
  name: "Series",
  store: store,
  props: {
    exerciseName: String,
    exerciseId: Number,
    parentIndex: Number,
  },
  data() {
    return {
      complete: false,
      reps: 0,
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    removeMe() {
      this.$emit("removeSeries", this.parentIndex);
    },
  },
  computed: {
    username() {
      // We will see what `params` is shortly
      return this.$route.params.username;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 10px 12px 3px 5px;
  text-align: left;
}
div {
  width: 100%;
}
p {
  font-weight: bold;
}
#exercise {
  padding: 0;
  display: inline-block;
  margin: 10px;
  border: 2px solid rgb(0, 85, 119);
  width: 90%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position: relative;
}
div.completed {
  background: rgb(170, 255, 170);
}
p {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 19px 2px 19px 2px;
}
p.completed {
  color: green;
  text-align: right;
  position: absolute;
  top: 0px;
  right: 0px;
  font-style: normal;
}
p.notcompleted {
  color: red;
  text-align: right;
  position: absolute;
  top: 0px;
  right: 0px;
  font-style: normal;
}

.row {
  width: 100%;
  padding: 0;
  margin: 0px;
  display: grid;
  grid-template-columns: auto auto auto;
}

button {
  margin: 4px 2px 4px 2px;
  width: 80%;
  font-size: 18;
}

.column-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  width: 45%;
}
</style>
