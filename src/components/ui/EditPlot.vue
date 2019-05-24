<template>
  <v-card @keydown.enter="$emit('update-plot-name', newName)">
    <v-card-title>Edit Plot</v-card-title>
    <v-card-text>
      <v-text-field label="Plot Label" required v-model="newName"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click.stop="$emit('close-dialog')">Cancel</v-btn>
      <v-btn flat color="error" @click.stop="$emit('delete-plot')">Delete</v-btn>
      <v-btn flat color="primary" @click.stop="$emit('update-plot-name', newName)">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'EditPlot',
  props: ['plot'],
  data () {
    return {
      newName: this.plot.name
    }
  }
}
</script>
