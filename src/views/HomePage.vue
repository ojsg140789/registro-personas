<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Clientes</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <v-btn block color="indigo-darken-3" to="/create">Agregar clientes</v-btn>
      <v-row>
        <v-col cols="10" md="4">
          <ion-refresher slot="fixed" @ionRefresh="getDocuments($event)">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>

          <ion-header collapse="condense">
            <ion-toolbar>
              <ion-title size="large">Clientes</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-list>
            <CustomerListItem v-for="customer in customers" :customer="customer" />
          </ion-list>
        </v-col>
      </v-row>
      <v-pagination v-model="page" :length="paginas" @click="siguiente">
      </v-pagination>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import CustomerListItem from '@/components/CustomerListItem.vue';
import { collection, getDocs, orderBy, query, limit, startAfter } from 'firebase/firestore';
import { db } from '@/utils/firestore';

export default {
  components: {
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    CustomerListItem
  },
  data() {
    return {
      customers: [] as any[],
      total: 0,
      paginas: 0,
      limit: 5,
      page: 1,
      lastvisible: "",
      firstVisible: "" as any,
    }
  },
  methods: {
    async getDocuments(ev?: CustomEvent) {
      this.customers = [];
      this.page = 1;
      const q = await query(collection(db, 'customers'));
      let customerCollection = await getDocs(q);
      let totalDocumentos = customerCollection.docs.length;
      console.log('totalDocumentos', totalDocumentos);
      this.total = totalDocumentos;
      this.paginas = Math.ceil(this.total / this.limit);

      const data = await query(
        collection(db, 'customers'),
        orderBy('name'),
        limit(this.limit)
      );

      const querySnapshot = await getDocs(data);
      querySnapshot.forEach((doc) => {
        this.customers.push({ ...doc.data(), id: doc.id })
      });
      if(ev) {
        ev.detail.complete();
      }
    },
    async siguiente() {
      const q = await query(collection(db, "customers"), orderBy("name"));
      const documentSnapshots = await getDocs(q);
      const firstVisible =
        documentSnapshots.docs[this.limit * (this.page - 1) - 1] || null;
      this.firstVisible = firstVisible;
      const next = await query(
        collection(db, "customers"),
        orderBy("name"),
        limit(this.limit),
        startAfter(this.firstVisible)
      );

      const querySnapshot = await getDocs(next);
      this.customers = [];
      querySnapshot.forEach((doc) => {
        let obra = doc.data();
        obra.id = doc.id;
        this.customers.push(obra);
      });
    },
  },
  mounted() {
    this.getDocuments();
  }
}
</script>
