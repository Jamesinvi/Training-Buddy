import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import Workout from "./components/Workout.vue"
import Login from "./components/Login.vue"
import Profile from "./components/Profile.vue"
import History from "./components/History.vue"
import Register from "./components/Register.vue"

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Buefy, { defaultFieldLabelPosition: "on-border" });

const moduleB = {
  namespaced: true,
  state: {
    workouts: [
      {
        name: "Leg Day",
        duration: "600",
        exercises: [
          {
            name: "Squat",
            description: "Brief description here",
            id: 0,
            time: 60,
            reps: 12,
            bpm: 0,
            rest: 20,
            type: "full",
            tag: "quad",
            usertag: "",
          },
          {
            name: "Sissy Squat",
            description: "Brief description here",
            id: 1,
            time: 200,
            reps: 35,
            rest: 20,
            type: "full",
            bpm: 0,
            tag: "quad",
            usertag: "",
          },
          {
            name: "Run",
            description: "Brief description here",
            id: 2,
            time: 600,
            reps: 0,
            rest: 20,
            type: "full",
            distance: 1000,
            tag: "quad",
            usertag: "",
          },
        ],
      },
      {
        name: "Arm Day",
        duration: "900",
        exercises: [
          {
            name: "Pull up",
            description: "Brief description here",
            id: 3,
            time: 600,
            reps: 15,
            rest: 20,
            type: "full",
            bpm: 0,
            tag: "arm",
            usertag: "",
          },
          {
            name: "Sissy Squat",
            description: "Brief description here",
            id: 4,
            time: 200,
            reps: 35,
            rest: 20,
            type: "full",
            bpm: 0,
            tag: "arm",
            usertag: "",
          },
          {
            name: "Run",
            description: "Brief description here",
            id: 5,
            time: 600,
            reps: 0,
            rest: 20,
            type: "full",
            distance: 1000,
            tag: "arm",
            usertag: "",
          },
        ],
      },
    ],
    user: {
      loggedIn: false,
      data: null,
      profileInfo: {
        goal: null,
        height: null,
        dateOfBirth: Date,
        weight: null,
        shouldersMeasurement: null,
        bicepMeasurement: null,
        chestMeasurement: null,
        waistMeasurement: null,
        thighMeasurement: null,
        extraInfo: null,
      },
    },
  },
  getters: {
    user: state => {
      return state.user
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_PROFILE_DATA(state, value) {
      state.user.profileInfo = value;
    },
    updateGoal(state, value) {
      state.user.profileInfo.goal = value;
    },
    updateDateOfBirth(state, value) {
      state.user.profileInfo.dateOfBirth = value;
    },
    updateWeight(state, value) {
      state.user.profileInfo.weight = value;
    },
    updateHeight(state, value) {
      state.user.profileInfo.height = value;
    },
    updateShouldersMeasurement(state, value) {
      state.user.profileInfo.shouldersMeasurement = value;
    },
    updateBicepMeasurement(state, value) {
      state.user.profileInfo.bicepMeasurement = value;
    },
    updateChestMeasurement(state, value) {
      state.user.profileInfo.chestMeasurement = value;
    },
    updateWaistMeasurement(state, value) {
      state.user.profileInfo.waistMeasurement = value;
    },
    updateThighMeasurement(state, value) {
      state.user.profileInfo.thighMeasurement = value;
    },
    updateExtraInfo(state, value) {
      state.user.profileInfo.extraInfo = value;
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
          uID: user.uid,
        });
      } else {
        commit("SET_USER", null);
      }
    },
    setUserProfileData({ commit }, profileData) {
      if (profileData) {
        commit("SET_PROFILE_DATA", profileData);
      } else {
        console.log("commit had null argument");
      }
    }
  },
}

const moduleA = {
  state: {
    completedWorkouts: [],
  },
  getters: {
    getCompletedWorkouts: state => {
      return state.completedWorkouts;
    }
  },
  mutations: {
    addCompletedWorkouts(state, value) {
      state.completedWorkouts.push(value);
    },
    setCompletedWorkouts(state, value) {
      state.completedWorkouts = value;
    }
  }
}

export const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})


// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Login },
  { path: '/login', name: "Login", component: Login },
  { path: '/register', name: "Register", component: Register },
  { path: "/workout", name: "Workout", component: Workout, meta: { requiresAuth: true, } },
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true, } },
  { path: "/history", name: "History", component: History, meta: { requiresAuth: true, } },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    console.log(`user logged in: ${store.state.b.user.loggedIn}`);
    if (!store.state.b.user.loggedIn) {
      next({
        name: 'Login'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})


//FIREBASE IMPORT AND INIT
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
var firebaseConfig = {
  apiKey: "AIzaSyDbRm9AQm2zhwJL_e5JqYavzHw-aWnvaLg",
  authDomain: "training-buddy-auth.firebaseapp.com",
  projectId: "training-buddy-auth",
  storageBucket: "training-buddy-auth.appspot.com",
  messagingSenderId: "768483259883",
  appId: "1:768483259883:web:a45de3a9b8354cf22695ae",
  measurementId: "G-ED3KQBV1RJ"
};

export const firebaseInstance = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

firebase.auth().onAuthStateChanged(async function (user) {
  //give our store displayname, email and uid of logged in user
  store.dispatch("b/fetchUser", user, { root: true });
  //give our store profile information from database
  let doc = await db.collection("users").doc(user.uid).get();
  if (!doc.exists) {
    let doc = await firebase.firestore().collection("users").doc(store.state.b.user.data.uID).set({ userProfileInfo: null })
    console.log("created new doc", doc);
  }
  store.dispatch("b/setUserProfileData", doc.data().userProfileInfo, { root: true });
  await firebase.firestore().collection("users").doc(store.state.b.user.data.uID).update({ workouts: store.state.b.workouts })
  let dbHistory = await db.collection("users").doc(user.uid).get();
  store.commit("setCompletedWorkouts", dbHistory.data().completedWorkouts, { root: true });


});


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

