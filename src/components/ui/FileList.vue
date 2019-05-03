<template>
  <v-expansion-panel color="secondary">
    <v-expansion-panel-content>
      <template v-slot:header>
        <h2>Plot List</h2>
      </template>
      <v-card>
        <!-- Plot list here -->
        <v-card-text>Plot list to go up in here</v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'FileList'
}
</script>
