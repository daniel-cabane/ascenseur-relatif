<template>
  <v-row>
    <v-card color='grey lighten-4' width='100%' min-width='370px' height='400px' class='pa-2 mb-2'>
      <span class='inset-text'>{{ value }}</span>
      <v-avatar v-for="(token, index) in tokenList" :key='`token-${index}`' :color="token ? 'white' : 'black'" class='ma-1 elevation-4'>
        <span class="display-1" v-if='token'>+</span>
        <span class="display-1 white--text" v-else>–</span>
      </v-avatar>
      <span></span>
    </v-card>
    <v-row style='display:flex;justify-content:space-around'>
      <v-btn @click='addWhite' :disabled='tokenList.length >= 20'>
        add <v-icon right>add_circle_outline</v-icon>
      </v-btn>
      <v-btn @click='addBlack' :disabled='tokenList.length >= 20'>
        add <v-icon right>remove_circle</v-icon>
      </v-btn>
      <v-btn @click='clear' color='error' outlined>
        clear <v-icon right>clear</v-icon>
      </v-btn>
    </v-row>
  </v-row>
</template>

<script>
  export default {
    name: 'tokenPanel',
    props: { index: Number },
    data: () => ({
      tokenList: []
    }),
    computed: {
      value(){
        if(this.tokenList.length == 0) return 0;
        let value = this.tokenList.reduce((total, num) => {
          let adding = num ? 1 : -1;
          return total + adding
        }, 0);
        return value > 0 ? `+${value}` : value;
      }
    },
    methods: {
      addWhite(){
        if(this.tokenList.length < 20){
          this.tokenList.push(true);
          this.eventBus.$emit('emitTerm', {val: this.value, index: this.index});
        }
      },
      addBlack(){
        if(this.tokenList.length < 20){
          this.tokenList.push(false);
          this.eventBus.$emit('emitTerm', {val: this.value, index: this.index});
        }
      },
      clear(){
        this.tokenList = [];
        this.eventBus.$emit('emitTerm', {val: this.value, index: this.index});
      }
    }
  }
</script>

<style scoped>
.inset-text {
    /* Shadows are visible under slightly transparent text color */
    position:absolute;
    top:0;
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 200px;
    color: rgba(240,240,240, 0.6);
    text-shadow: 1px 4px 6px #eee, 0 0 0 #333, 1px 4px 6px #eee;
}
</style>
