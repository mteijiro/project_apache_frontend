<template>
    <div class="greetings">
        <h2>Submit A Complaint</h2>
        <form v-on:submit="submitComplaint">
            <div>Username:</div>
            <input type="text" v-model="newComplaint.username" value="username">
            <div>Password:</div>
            <input type="text" v-model="newComplaint.password" value="password">
            <div>Severity: {{ newComplaint.severity }}</div><select v-model="newComplaint.severity">
                <option disabled value="">Select Severity</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
            <div>Category: {{ newComplaint.category }}</div>
            <select v-model="newComplaint.category">
                <option disabled value="">Define Category</option>
                <option>Street Noise</option>
                <option>Automobile</option>
                <option>Business Noise</option>
            </select>
            <br />
            <span>Location</span>
            <input type="text" v-model="newComplaint.latitude" value="latitude">
            <input type="text" v-model="newComplaint.longitude" value="longitude">
            <br />
            <button v-on:click="submitComplaint(newComplaint)">Submit</button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'greetings-page.vue',
  props: {
    username: {
      type: String,
      default: 'mteijiro'
    },
    password: {
      type: String,
      default: 'Temp12345'
    },
    category: {
      type: String,
      default: 'People'
    },
    severity: {
      type: String,
      default: 'Low'
    },
    latitude: {
      type: String,
      default: '0.0'
    },
    longitude: {
      type: String,
      default: '0.0'
    }
  },
  data () {
    return {
      newComplaint: {}
    }
  },
  methods: {
    submitComplaint: function (newComplaint) {
      console.log(JSON.stringify(newComplaint))
      alert(JSON.stringify(newComplaint))
      fetch('http://localhost:8000/complaints/', {
        body: JSON.stringify(newComplaint),
        method: 'POST'
      })
        .then(() => {
          alert('Your complaint has been submitted!')
        })
    }
  },
  created: function () {

  }
}
</script>

<style scoped>

</style>
