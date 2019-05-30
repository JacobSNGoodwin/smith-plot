<template>
  <v-dialog
    v-if="error !== null"
    :value="error !== null"
    max-width="500"
    @update:returnValue="$emit('clear-error')"
  >
    <v-card>
      <v-card-title class="headline error" primary-title>An error has occured</v-card-title>

      <v-card-text class="body-2">{{error.userMessage}}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('clear-error')">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    error: Object
  }
}
</script>
