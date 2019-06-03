<template>
  <v-card @keydown.enter="$emit('update-file-name', newName)">
    <v-card-title>Edit Name</v-card-title>
    <v-card-text>
      <v-text-field label="File Label" required v-model="newName"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click.stop="$emit('close-dialog')">Cancel</v-btn>
      <v-btn flat color="error" @click.stop="$emit('delete-file')">Delete</v-btn>
      <v-btn flat color="primary" @click.stop="$emit('update-file-name', newName)">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'EditFile',
  props: ['file'],
  data () {
    return {
      newName: this.file.fileName
    }
  }
}
</script>
