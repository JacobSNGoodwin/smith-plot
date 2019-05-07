<template>
  <v-card>
    <v-card-title>Edit Plot</v-card-title>
    <v-card-text>
      <p>Input here</p>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click.stop="$emit('close-dialog')">Cancel</v-btn>
      <v-btn flat color="error" @click.stop="$emit('delete-plot')">Delete</v-btn>
      <v-btn flat color="primary" @click.stop="$emit('update-plot-name')">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'EditPlot',
  props: ['name'],
  data () {
    return {
      newName: name
    }
  }
}
</script>
