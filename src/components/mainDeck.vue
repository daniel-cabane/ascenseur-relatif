<template>
  <v-container @keydown.enter='submitAnswer'>
    <v-alert type="error" v-if='["xs", "sm"].includes(this.$vuetify.breakpoint.name)'>
      Votre écran n'est pas assez large pour afficher cette application correctement
    </v-alert>
    <v-snackbar v-model="snackbar" top :color='snackColor'>
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn :color="snackColor" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-row>
      <v-col cols='9'>
        <v-row>
          <v-col cols='5' style='display:flex;justify-content:center;align-items:center;'>
            <tokenPanel :index='0'/>
          </v-col>
          <v-col cols='2' style='display:flex;justify-content:center;align-items:center;'>
            <v-hover v-slot:default="{ hover }">
              <v-card
                class='display-4 font-weight-bold'
                :elevation="hover && !challengeActive ? 5 : 0"
                :color="hover ? 'white' : 'white'"
                height="80" width="80"
                style='display:flex;justify-content:center;align-items:center;cursor:pointer'
                @click='switchOperation'
                >
                <span v-if='operation'>+</span>
                <span v-else>–</span>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols='5' style='display:flex;justify-content:center;align-items:center;'>
            <tokenPanel :index='1'/>
          </v-col>
        </v-row>
        <v-btn block color='primary' x-large class='mt-4' @click='moveLift' :disabled='challengeActive'>
          Effectuer
        </v-btn>
      </v-col>
      <v-col cols='1'></v-col>
      <v-col cols='2' style='position:relative' class='py-0'>
          <v-card x-large color="primary" outlined class='display-1 font-weight-bold text-xs-center white--text' style='z-index:10' min-width='120px' max-width='120px'>
            <div style='width:100%;display:flex;justify-content:center'>
              {{ result | formatNb }}
            </div>
          </v-card>
        <v-img min-width='170px' max-width='170px' src="../assets/axe.png"></v-img>
        <v-img id='lift' class='smoothMove' min-width='75px' max-width='75px' src="../assets/lift.png" style='position:absolute;top:219px;left:34px'></v-img>
      </v-col>
    </v-row>
    <v-row class='mt-4'>
      <v-select v-model='challengeNb' :items="challenges" class='mx-2' label="Sélectionner un défi" :disabled='challengeActive' outlined></v-select>
      <div style='display:flex' v-if='challengeActive'>
        <v-text-field type='number' v-model='challengeResult' label='Résultat' autofocus outlined v-if='challengeNb%2 == 1'/>
        <v-btn class="mx-2" fab dark color="success" @click='submitAnswer'>
          <v-icon dark>done</v-icon>
        </v-btn>
        <v-btn class="mx-2" fab dark color="error" @click='endChallenge'>
          <v-icon dark>clear</v-icon>
        </v-btn>
      </div>
      <v-btn style='width:215px' x-large class='mx-2' color='primary' @click='startChallenge' v-else>
        Lancer le défi
      </v-btn>
    </v-row>
    <v-row class='headline mb-4'>
      <v-spacer></v-spacer>
      <span v-html='challengeText'></span>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
  import tokenPanel from './tokenPanel';

  export default {
    name: 'mainDeck',
    components: {
      tokenPanel,
    },
    data: () => ({
      operation: true,
      terms: [0, 0],
      result: 0,
      challenges: [
        {text: 'Défi 1 - Addition', value: 1},
        {text: 'Défi 2 - Addition incomplète', value: 2},
        {text: 'Défi 3 - Soustraction', value: 3},
        {text: 'Défi 4 - Soustraction incomplète', value: 4},
      ],
      challengeNb: null,
      challengeResult: '',
      challengeActive: false,
      challengeText: '',
      expectedResult: 0,
      snackbar: false,
      snackColor: 'success',
      snackText: 'Exact !'
    }),
    mounted(){
      this.eventBus.$on('emitTerm', data => {
        this.terms[data.index] = data.val;
      });
    },
    filters:{
      formatNb(nb){
        if(nb == 0) return 0;
        if(nb > 0) return `+${nb}`;
        return `–${-nb}`
      }
    },
    methods: {
      moveLift(){
        let result = this.operation ? parseInt(this.terms[0])+parseInt(this.terms[1]) : parseInt(this.terms[0])-parseInt(this.terms[1]);
        document.getElementById("lift").style.transform = `translateY(${-result*12+1+Math.sign(result)}px)`;
        if(this.result != result){
          let count = setInterval(()=> {
            this.result += Math.sign(result-this.result);
            if(this.result == result) clearInterval(count);
          }, 500/Math.abs(result-this.result));
        }
      },
      switchOperation(){
        if(!this.challengeActive){
          this.operation = !this.operation;
        }
      },
      startChallenge(){
        if(this.challengeNb > 0){
          document.getElementById("lift").style.transform = 'translateY(0px)';
          if(this.result != 0){
            let count = setInterval(()=> {
              this.result += Math.sign(-this.result);
              if(this.result == 0) clearInterval(count);
            }, 500/Math.abs(-this.result));
          }
          this.challengeResult = '';
          this.eventBus.$emit('startChallenge', this.challengeNb);
          this.operation = this.challengeNb <= 2;
          this.challengeActive = true;
          switch(this.challengeNb%2){
            case 0:
            this.expectedResult = Math.sign(Math.random()-0.5)*Math.floor(Math.random()*15);
            this.challengeText = `Complète l'opération pour arriver à l'étage <span class='display-1 font-weight-bold'>${this.expectedResult}</span>`
            break;
            case 1:
              this.challengeText = "Effectue l'opération"
            break;
          }
        }
      },
      submitAnswer(){
        if(this.challengeActive){
          let resultA = this.operation ? parseInt(this.terms[0])+parseInt(this.terms[1]) : parseInt(this.terms[0])-parseInt(this.terms[1]);
          let resultB = this.challengeNb%2 == 0 ? this.expectedResult : this.challengeResult
          if(resultA == resultB){
            this.snackColor = 'success';
            this.snackText = 'Exact !';
            this.snackbar = true;
            this.endChallenge();
          } else {
            this.challengeResult = '';
            this.snackColor = 'error';
            this.snackText = 'Non, essaie encore';
            this.snackbar = true;
          }
        }
      },
      endChallenge(){
        this.moveLift();
        this.challengeActive = false;
        this.challengeText = '';
        this.eventBus.$emit('endChallenge', {});
      }
    }
  }
</script>

<style scoped>
  .smoothMove {
    transition: all .5s
  }
</style>
