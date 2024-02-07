<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="'Regresar'" default-href="/"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <v-form>
            <v-row>
              <v-col cols="11" md="4">
                <v-text-field v-model="customer.name" label="Nombre" required :maxlength="50"></v-text-field>
                <div v-if="v$.customer.name.required.$invalid && submited">Nombre requerido.</div>
              </v-col>

              <v-col cols="11" md="4">
                <v-text-field v-model.number="customer.age" label="Edad" required type="number"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength="3"></v-text-field>
                <div v-if="v$.customer.age.required.$invalid && submited">Edad requerida.</div>
              </v-col>

              <v-col cols="11" md="4">
                <v-text-field v-model="customer.email" label="E-mail" required></v-text-field>
                <div v-if="v$.customer.email.email.$invalid && customer.email">Correo inválido.</div>
                <div v-if="v$.customer.email.required.$invalid && submited">Correo requerido.</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" md="4">
                <v-btn block color="indigo-darken-3" @click="addCustomer"
                :disabled="v$.$invalid">Agregar</v-btn>
              </v-col>
            </v-row>
        </v-form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
} from '@ionic/vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/utils/firestore';

export default {
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonNote,
    IonPage,
    IonToolbar,
  },
  data() {
    return {
      v$: useVuelidate(),
      customer: {
        email:'',
        name: '',
        age: ''
      },
      submited: false
    }
  },
  validations() {
    return {
      customer: {
        email: { required, email },
        name: { required },
        age: { required }
      }
    }
  },
  methods: {
    async addCustomer() {
      this.submited = true;
      await addDoc(collection(db, 'customers'), this.customer)
      .then(() => {
        alert('Registrado correctamente');
        this.submited = false;
        this.customer = {
          email:'',
          name: '',
          age: ''
        };
      }).catch(() => {
        alert('Hubo un problema');
      });
    }
  }
}

</script>

<style scoped>
ion-item {
  --inner-padding-end: 0;
  --background: transparent;
}

ion-label {
  margin-top: 12px;
  margin-bottom: 12px;
}

ion-item h2 {
  font-weight: 600;

  /**
   * With larger font scales
   * the date/time should wrap to the next
   * line. However, there should be
   * space between the name and the date/time
   * if they can appear on the same line.
   */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

ion-item .date {
  align-items: center;
  display: flex;
}

ion-item ion-icon {
  font-size: 42px;
  margin-right: 8px;
}

ion-item ion-note {
  font-size: 0.9375rem;
  margin-right: 12px;
  font-weight: normal;
}

h1 {
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
}

p {
  line-height: 1.4;
}
</style>
