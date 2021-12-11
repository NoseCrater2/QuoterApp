<template>
  <q-page class="flex">
    <span v-if="order.id" class="q-pl-md text-red">Editando persiana {{order.id}}</span>
    <q-stepper
      flat
      v-model="step"
      vertical
      color="primary"
      animated
      style="width: 100%;"
    >
      <q-step
      :name="1"
      :title="order.type != null && order.manufacturer != null ?`TIPO: ${order.type.toUpperCase()} y FABRICANTE: ${order.manufacturer}`:'Selecciona Tipo y Línea'"
      prefix="1"
      :done="step > 1"
      >
        <q-select
        behavior="menu"
        :dense="true"
        :options-dense="true"
        rounded
        outlined
        option-value="slug"
        option-label="name"
        emit-value
        map-options
        input-debounce="0"
        v-model="order.type"
        color="primary"
        :options="getProduct ? getProduct.types : null"
        lazy-rules
        @input="chargeTypeModels(order.type)"
        label="Tipo"
        style="padding: 10px 0px"
        ></q-select>
        <q-select
        v-if="getType && order.type != 'vertical'"
        behavior="menu"
        :dense="true"
        :options-dense="true"
        rounded
        outlined
        option-value="slug"
        option-label="name"
        emit-value
        map-options
        input-debounce="0"
        v-model="order.manufacturer"
        color="primary"
        :options="getType.lines"
        lazy-rules
        label="Marca"
        @input="step = 2"
        ></q-select>
        <q-stepper-navigation class="flex">
          <q-space></q-space>
          <q-btn
          v-if="(order.type != null && order.manufacturer != null) || order.type == 'vertical'"
          @click="step = 2"
          color="primary"
          icon="arrow_downward"
          flat rounded
          ></q-btn>
        </q-stepper-navigation>
      </q-step>
      <div v-if="order.type === 'horizontal-madera-2' || order.type === 'horizontal-aluminio-2'">
        <q-step
        :name="2"
        :title="order.motor_type != null? `Modo de accionamiento: ${order.motor_type}` : 'Selecciona modo de accionamiento'"
        prefix="2"
        :done="order.motor_type != null"
        >
            <q-banner v-if="step === 2 && order.motor_type === 'Motorizado'" class="bg-orange-8 text-white q-px-lg">
              Para persiana motorizada el accionamiento solo es posible con escalerilla.
            </q-banner>
          <q-option-group
          @input="chargeWoodPrices"
          v-model="order.motor_type"
          :options="motor_type_options"
          color="primary"
          inline
          ></q-option-group>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 1" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn @click="step = 3" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        :name="3"
        :title="order.motor.drive != null? `Accionamiento: ${order.motor.drive}` : 'Selecciona Accionamiento'"
        prefix="3"
        :done="step > 3"
        >
          <q-option-group
          v-model="order.motor.drive"
          :options="motor_drive_options"
          color="primary"
          inline
          ></q-option-group>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 2" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn @click="step = 4" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        :name="4"
        :title="order.motor.side_control != null? afterSideControlTitle: preSideControlTitle"
        prefix="4"
        :done="step > 4"
        >
          <q-option-group
          v-model="order.motor.side_control"
          :options="motor_sidecontrol_options"
          color="primary"
          inline
          ></q-option-group>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 3" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn @click="step = 5" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-btn-dropdown
        v-if="order.canvas[0].height != null"
        size="sm"
        class="bg-primary"
        flat
        :label="`Lienzos ${order.canvas.length}`"
        rounded
        color="white"
        no-icon-animation
        style="position: absolute;right: 30px;margin-top: 10px;z-index: 2;"
        >
          <q-list dense>
            <q-item v-for="(canvas, index) in order.canvas" :key="index">
              <q-item-section avatar>
                <q-avatar size="sm" color="primary"  text-color="white">{{ index + 1 }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>
                  Ancho: {{ canvas.width }}m
                </q-item-label>
                <q-item-label caption>
                  Alto: {{ canvas.height }}m
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-step
        :name="5"
        title="Selecciona medidas"
        prefix="5"
        :done="step > 5"
        >
          <q-form ref="sizewoodform">
          <q-input
          stack-label
          dense
          label-slot
          type="number"
          v-model.number="order.canvas[0].width"
          :rules="[
             ...widthWoodRules(),
          ]"
          rounded
          outlined>
            <template v-slot:label>
              <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                Ancho de {{ widthMargins }} metros
              </em>
            </template>
          </q-input>
          <q-input
          stack-label
          label-slot
          type="number"
          :dense="true"
          v-model.number="order.canvas[0].height"
          :rules="[
           ...heightWoodRules(),
          ]"
          rounded
          style="min-width: 255px"
          outlined>
          <template v-slot:label>
              <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                Alto de {{ heightMargins }} metros
              </em>
            </template>
          </q-input>
        </q-form>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 4" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn @click="step = 6" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        :name="6"
        :title="order.motor.frame != null? `Marco: ${order.motor.frame}`: 'Selecciona Marco'"
        prefix="6"
        :done="step > 6"
        >
          <q-option-group
          v-model="order.motor.frame"
          :options="motor_frame_options"
          color="primary"
          inline
          ></q-option-group>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 5" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn @click="step = 7" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        :name="7"
        :title="order.variant != null? `Modelo: `: 'Seleccione modelo y color'"
        prefix="7"
        :done="step > 7"
        >
          <q-select
          behavior="menu"
          :rules="[ val => val || 'Requerido']"
          :options="models"
          :dense="true"
          :options-dense="true"
          rounded
          outlined
          @input="chargeColors"
          option-value="slug"
          option-label="name"
          v-model="order.variant"
          emit-value
          map-options
          use-input
          fill-input
          input-debounce="0"
          color="primary"
          label="Seleccione modelo"
          lazy-rules
          @filter="filterFn"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
        </q-select>
        <q-img
        v-if="order.variant != null"
        :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${$store.getters.getVariant(order.variant, order.type).image}.jpg`"
        style="height: 100px; max-width: 100%"
        >
          <template v-slot:error>
            <q-img
            :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
            style="height: 100px; width: 100%"
            ></q-img>
          </template>
        </q-img>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 6" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn @click="step = 8" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="8"
      title="Últimas acciones"
      prefix="8"
      :done="step > 8"
      >
        <q-stepper-navigation class="flex justify-center">
           <q-btn @click="step = 7" color="primary" label="atrás" flat rounded></q-btn>
          <q-btn label="TERMINAR PERSIANA" @click="addBlind()" color="orange"></q-btn>
          <!-- <q-btn color="green" label="REALIZAR PEDIDO"></q-btn>
          <q-btn color="green" outline label="GUARDAR COTIZACIÓN"></q-btn> -->
        </q-stepper-navigation>
      </q-step>
      </div>
      <div v-else-if="order.type === 'celular'">
        <q-step
        :name="2"
        :title="order.celular_type != null?`Persiana celular: ${order.celular_type}`:'Selecciona el tipo de persiana celular que quieres'"
        prefix="2"
        :done="step > 2">
          <q-item
          v-for="(c, index) in celulares"
          :key="index"
          clickable
          v-ripple
          @click="assignCelularType(c.title)"
          :active="order.celular_type === c.title"
          active-class="selected-celular-type">
            <q-item-section class="q-pa-sm" top thumbnail >
              <img :src="c.img">
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ c.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 1" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn v-if="order.celular_type != null" @click="step = 3" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-btn-dropdown
      v-if="order.canvas[0].height != null"
      size="sm"
      class="bg-primary"
      flat
      :label="`Lienzos ${order.canvas.length}`"
      rounded
      color="white"
      no-icon-animation
      style="position: absolute;right: 30px;margin-top: 10px;z-index: 2;"
      >
        <q-list dense>
          <q-item v-for="(canvas, index) in order.canvas" :key="index">
            <q-item-section avatar>
              <q-avatar size="sm" color="primary"  text-color="white">{{ index + 1 }}</q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>
                Ancho: {{ canvas.width }}m
              </q-item-label>
              <q-item-label caption>
                Alto: {{ canvas.height }}m
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-step
        :name="3"
        title="Selecciona las medidas"
        prefix="3"
        :done="step > 3">
          <q-form ref="sizecelularform">
            <q-input
            stack-label
            dense
            label-slot
            type="number"
            v-model.number="order.canvas[0].width"
            :rules="[
              ...widthCelularRules(),
            ]"
            rounded
            outlined>
              <template v-slot:label>
                <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                  Ancho de {{ widthMargins }} metros
                </em>
              </template>
            </q-input>
            <q-input
            stack-label
            label-slot
            type="number"
            :dense="true"
            v-model.number="order.canvas[0].height"
            :rules="[
              ...heightCelularRules(),
            ]"
            rounded
            style="min-width: 255px"
            outlined>
              <template v-slot:label>
                  <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                    Alto de {{ heightMargins }} metros
                  </em>
                </template>
              </q-input>
        </q-form>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 2" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn v-if="order.canvas[0].height > 0" @click="checkCelularSize" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="4"
      :title="order.celular_drive != null?`Accionamiento: ${order.celular_drive}`:'Selecciona modo de accionamiento'"
      prefix="4"
      :done="step > 4">
        <q-option-group
        v-model="order.celular_drive"
        :options="celular_drive_options"
        color="primary"
        inline
        ></q-option-group>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 3" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn v-if="order.celular_drive != null" @click="step = 5" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
        <q-step
        v-if="order.celular_drive === 'Cordón' || order.celular_drive === 'Motor'"
        :name="5"
        :title="order.motor.side_control != null?`Lado del mando o motor: ${order.motor.side_control}`:'Selecciona lado del mando o motor'"
        prefix="5"
        :done="step > 5">
          <q-option-group
          v-model="order.motor.side_control"
          :options="motor_sidecontrol_options"
          color="primary"
          inline
          ></q-option-group>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 4" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn v-if="order.celular_drive != null" @click="step = 6" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        v-if="order.celular_drive === 'Cordón' || order.celular_drive === 'Motor'"
        :name="6"
        :title="order.celular_variant != null?`Modelo: ${order.celular_variant.title}`:'Seleccione modelo y color'"
        prefix="6"
        :done="step > 6">
        <div v-if="order.celular_type === 'Día y Noche'">
          <q-select
          behavior="menu"
          :options="celular_variants"
          :dense="true"
          :options-dense="true"
          @input="chargeCelularColors()"
          rounded
          outlined
          option-label="title"
          v-model="order.celular_variant"
          emit-value
          map-options
          input-debounce="0"
          color="primary"
          label="Seleccione Modelo"
          style="padding: 10px 0px"
          ></q-select>
          <div class="row">
            <div class="col">
              <q-select
              stack-label
              label-slot
              behavior="menu"
              :options="colors"
              :options-dense="true"
              rounded
              outlined
              v-model="order.color"
              emit-value
              map-options
              input-debounce="0"
              color="primary"
              label="Color Día"
              style="padding: 10px 0px">
                <template v-slot:label>
                  <em class="q-px-sm bg-teal-6 text-white rounded-borders">
                    Color Día
                  </em>
                </template>
              </q-select>
              <q-img
              v-if="order.color != null"
              :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.color.code}.jpg`"
              style="height: 100px; max-width: 90%"
              >
                <template v-slot:error>
                  <q-img
                  :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
                  style="height: 100px; width: 90%"
                  ></q-img>
                </template>
              </q-img>
            </div>
            <div class="col">
              <q-select
              stack-label
              label-slot
              behavior="menu"
              :options="colors2"
              :options-dense="true"
              rounded
              outlined
              v-model="order.second_color"
              emit-value
              map-options
              input-debounce="0"
              color="primary"
              style="padding: 10px 0px">
                <template v-slot:label>
                  <em class="q-px-sm bg-grey-10 text-white rounded-borders">
                    Color Noche
                  </em>
                </template>
              </q-select>
              <q-img
              v-if="order.second_color != null"
              :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.second_color.code}.jpg`"
              style="height: 100px; max-width: 90%"
              >
                <template v-slot:error>
                  <q-img
                  :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
                  style="height: 100px; width: 90%"
                  ></q-img>
                </template>
              </q-img>
            </div>
          </div>
        </div>
        <div v-if="order.celular_type === 'Muelle/Cordón'">
        <q-select
          behavior="menu"
          :rules="[ val => val || 'Requerido']"
          :options="models"
          :dense="true"
          :options-dense="true"
          rounded
          outlined
          @input="chargeColors"
          option-value="slug"
          option-label="name"
          v-model="order.variant"
          emit-value
          map-options
          use-input
          fill-input
          input-debounce="0"
          color="primary"
          label="Seleccione modelo"
          lazy-rules
          @filter="filterFn">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
          behavior="menu"
          :options="colors"
          :dense="true"
          :options-dense="true"
          :loading="loadingColors"
          @input="selectColor()"
          rounded
          outlined
          option-label="color"
          v-model="order.color"
          emit-value
          map-options
          input-debounce="0"
          color="primary"
          label="Seleccione color"
          style="padding: 10px 0px"
          lazy-rules>
          </q-select>
          <q-img
          v-if="order.color != null"
          :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.color.code}.jpg`"
          style="height: 100px; max-width: 100%"
          >
          <template v-slot:error>
              <q-img
              :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
              style="height: 100px; width: 100%"
              ></q-img>
          </template>
        </q-img>
        </div>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 5" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn v-if="order.color != null" @click="step = 7" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        v-if="order.celular_drive === 'Cordón' || order.celular_drive === 'Motor'"
        :name="7"
        :title="order.motor.frame != null? `Marco: ${order.motor.frame}`: 'Selecciona Marco'"
        prefix="7"
        :done="step > 7">
          <q-option-group
          v-model="order.motor.frame"
          :options="motor_frame_options"
          color="primary"
          inline
          ></q-option-group>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 6" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn v-if="order.motor.frame != null" @click="step = 8" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        v-if="order.celular_drive === 'Cordón'"
        :name="8"
        title="Últimas opciones"
        prefix="8"
        :done="step > 8">
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 6" color="primary" label="atrás" flat rounded></q-btn>
            <q-btn label="TERMINAR PERSIANA" @click="addBlind()" color="orange"></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        v-if="order.celular_drive === 'Motor'"
        :name="8"
        title="Seleccione motorización"
        prefix="8"
        :done="step > 8">
          <q-select
          clearable
          behavior="menu"
          :options="celularMotors"
          :dense="true"
          :options-dense="true"
          option-value="id"
          option-label="system"
          emit-value
          rounded
          outlined
          v-model="order.motor.motor"
          map-options
          input-debounce="0"
          color="primary"
          label="Seleccione motor"
          style="padding: 10px 0px"
          lazy-rules>
          </q-select>
          <q-select
          clearable
          behavior="menu"
          :options="controls"
          :dense="true"
          :options-dense="true"
          option-label="description"
          emit-value
          rounded
          outlined
          v-model="order.motor.control"
          map-options
          input-debounce="0"
          color="primary"
          label="Seleccione control (opcional)"
          style="padding: 10px 0px"
          lazy-rules>
          </q-select>
         <q-stepper-navigation class="flex">
            <q-btn @click="step = 7" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn  @click="step = 9" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
         <q-step
        v-if="order.celular_drive === 'Motor'"
        :name="9"
        title="Últimas opciones"
        prefix="9"
        :done="step > 9">
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 8" color="primary" label="atrás" flat rounded></q-btn>
            <q-btn label="TERMINAR PERSIANA" @click="addBlind()" color="orange"></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        v-if="order.celular_drive === 'Muelle'"
        :name="5"
        :title="order.celular_variant != null?`Modelo: ${order.celular_variant.title}`:'Seleccione modelo y color'"
        prefix="5"
        :done="step > 5">
          <div v-if="order.celular_type === 'Muelle/Cordón'">
          <q-select
          behavior="menu"
          :rules="[ val => val || 'Requerido']"
          :options="models"
          :dense="true"
          :options-dense="true"
          rounded
          outlined
          @input="chargeColors"
          option-value="slug"
          option-label="name"
          v-model="order.variant"
          emit-value
          map-options
          use-input
          fill-input
          input-debounce="0"
          color="primary"
          label="Seleccione modelo"
          lazy-rules
          @filter="filterFn">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
          behavior="menu"
          :options="colors"
          :dense="true"
          :options-dense="true"
          :loading="loadingColors"
          @input="selectColor()"
          rounded
          outlined
          option-label="color"
          v-model="order.color"
          emit-value
          map-options
          input-debounce="0"
          color="primary"
          label="Seleccione color"
          style="padding: 10px 0px"
          lazy-rules>
          </q-select>
          <q-img
          v-if="order.color != null"
          :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.color.code}.jpg`"
          style="height: 100px; max-width: 100%"
          >
          <template v-slot:error>
              <q-img
              :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
              style="height: 100px; width: 100%"
              ></q-img>
          </template>
        </q-img>
        </div>
        <div v-if="order.celular_type === 'Día y Noche'">
          <q-select
          behavior="menu"
          :options="celular_variants"
          :dense="true"
          :options-dense="true"
          @input="chargeCelularColors()"
          rounded
          outlined
          option-label="title"
          v-model="order.celular_variant"
          emit-value
          map-options
          input-debounce="0"
          color="primary"
          label="Seleccione Modelo"
          style="padding: 10px 0px"
          ></q-select>
          <div class="row">
            <div class="col">
              <q-select
              stack-label
              label-slot
              behavior="menu"
              :options="colors"
              :options-dense="true"
              rounded
              outlined
              option-label="color"
              v-model="order.color"
              emit-value
              map-options
              input-debounce="0"
              color="primary"
              style="padding: 10px 0px">
                <template v-slot:label>
                  <em class="q-px-sm bg-teal-6 text-white rounded-borders">
                    Color Día
                  </em>
                </template>
              </q-select>
              <q-img
              v-if="order.color != null"
              :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.color.code}.jpg`"
              style="height: 100px; max-width: 90%"
              >
                <template v-slot:error>
                  <q-img
                  :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
                  style="height: 100px; width: 90%"
                  ></q-img>
                </template>
              </q-img>
            </div>
            <div class="col">
              <q-select
              stack-label
              label-slot
              behavior="menu"
              :options="colors2"
              :options-dense="true"
              rounded
              outlined
              option-label="color"
              v-model="order.second_color"
              emit-value
              map-options
              input-debounce="0"
              color="primary"
              style="padding: 10px 0px">
                <template v-slot:label>
                  <em class="q-px-sm bg-grey-10 text-white rounded-borders">
                    Color Noche
                  </em>
                </template>
              </q-select>
              <q-img
              v-if="order.second_color != null"
              :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.second_color.code}.jpg`"
              style="height: 100px; max-width: 90%"
              >
                <template v-slot:error>
                  <q-img
                  :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
                  style="height: 100px; width: 90%"
                  ></q-img>
                </template>
              </q-img>
            </div>
          </div>
        </div>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 4" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn v-if="order.color != null" @click="step = 6" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        v-if="order.celular_drive === 'Muelle'"
        :name="6"
        :title="order.motor.frame != null? `Marco: ${order.motor.frame}`: 'Selecciona Marco'"
        prefix="6"
        :done="step > 6">
          <q-option-group
          v-model="order.motor.frame"
          :options="motor_frame_options"
          color="primary"
          inline
          ></q-option-group>
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 5" color="primary" icon="arrow_upward" flat rounded></q-btn>
            <q-space></q-space>
            <q-btn v-if="order.motor.frame != null" @click="step = 7" color="primary" icon="arrow_downward" flat rounded></q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step
        v-if="order.celular_drive === 'Muelle'"
        :name="7"
        title="Últimas opciones"
        prefix="7"
        :done="step > 7">
          <q-stepper-navigation class="flex">
            <q-btn @click="step = 6" color="primary" label="atrás" flat rounded></q-btn>
            <q-btn label="TERMINAR PERSIANA" @click="addBlind()" color="orange"></q-btn>
          </q-stepper-navigation>
        </q-step>
      </div>
      <div v-else>
      <q-step
      :name="2"
      :title="order.variant != null ?`TEJIDO: ${order.line} MODELO: ${$store.getters.getVariant(order.variant, order.type).name}`:'Selecciona modelo'"
      prefix="2"
      :done="step > 2"
      >
        <q-select
        behavior="menu"
        :dense="true"
        :options-dense="true"
        v-if="getType && getType.weaves.length > 0"
        :options="getType.weaves"
        rounded
        outlined
        option-value="slug"
        option-label="name"
        v-model="order.line"
        emit-value
        map-options
        input-debounce="0"
        color="primary"
        style="padding: 10px 0px"
        label="Seleccione tejido"
        lazy-rules
        ></q-select>
        <q-option-group
        v-if="order.type == 'vertical'"
        v-model="order.cloth_holder"
        :options="cloth_holder_options"
        color="primary"
        inline
        ></q-option-group>
        <q-select
        behavior="menu"
        :rules="[ val => val || 'Requerido']"
        :options="models"
        :dense="true"
        :options-dense="true"
        rounded
        outlined
        @input="chargeColors"
        option-value="slug"
        option-label="name"
        v-model="order.variant"
        emit-value
        map-options
        use-input
        fill-input
        input-debounce="0"
        color="primary"
        label="Seleccione modelo"
        lazy-rules
        @filter="filterFn"
        >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Sin resultados
            </q-item-section>
          </q-item>
        </template>
        </q-select>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 1" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn v-if="order.color != null" @click="step = 3" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="3"
      :title="order.color != null ?`COLOR: ${order.color.color} `:'Selecciona color'"
      prefix="3"
      :done="step > 3"
      >
        <q-select
        behavior="menu"
        :options="colors"
        :dense="true"
        :options-dense="true"
        :loading="loadingColors"
        @input="selectColor()"
        rounded
        outlined
        option-label="color"
        v-model="order.color"
        emit-value
        map-options
        input-debounce="0"
        color="primary"
        label="Seleccione color"
        style="padding: 10px 0px"
        lazy-rules>
        </q-select>
        <q-img
        v-if="order.type === 'horizontal-aluminio-1' && order.variant != null"
        :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${$store.getters.getVariant(order.variant, order.type).image}.jpg`"
        style="height: 100px; max-width: 100%"
        >
        <template v-slot:error>
            <q-img
            :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
            style="height: 100px; width: 100%"
            ></q-img>
          </template>
        </q-img>
        <q-img
        v-else-if="order.color != null"
        :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.color.code}.jpg`"
        style="height: 100px; max-width: 100%"
        >
          <template v-slot:error>
            <q-img
            :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
            style="height: 100px; width: 100%"
            ></q-img>
          </template>
        </q-img>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 2" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn @click="step = 4" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-btn-dropdown
      v-if="order.canvas[0].height != null"
      size="sm"
      class="bg-primary"
      flat
      :label="`Lienzos ${order.canvas.length}`"
      rounded
      color="white"
      no-icon-animation
      style="position: absolute;right: 30px;margin-top: 10px;z-index: 2;"
      >
        <q-list dense>
          <q-item v-for="(canvas, index) in order.canvas" :key="index">
            <q-item-section avatar>
              <q-avatar size="sm" color="primary"  text-color="white">{{ index + 1 }}</q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>
                Ancho: {{ canvas.width }}m
              </q-item-label>
              <q-item-label caption>
                Alto: {{ canvas.height }}m
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-step
      :name="4"
      title="Selecciona Medidas"
      prefix="4"
      :done="step > 4"
      >
        <q-form ref="sizeform">
          <div  v-if="order.type=='flexibalet'">
            <q-input
            stack-label
            dense
            label-slot
            type="number"
            v-model.number="order.canvas[0].width"
            :rules="[
              ...flexiballetWidthRules()
            ]"
            style="padding-bottom: 35px;"
            rounded
            outlined>
              <template v-slot:label>
                <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                  Ancho de {{ widthMargins }} metros
                </em>
              </template>
            </q-input>
            <q-input
            stack-label
            label-slot
            type="number"
            :dense="true"
            v-model.number="order.canvas[0].height"
            :rules="[
              ...flexiballetHeightRules()
            ]"
            rounded
            outlined>
            <template v-slot:label>
                <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                  Alto de {{ heightMargins }} metros
                </em>
              </template>
            </q-input>
          </div>
          <div v-else>
            <q-input
            stack-label
            dense
            label-slot
            type="number"
            v-model.number="order.canvas[0].width"
            :rules="[
              widthCanvasRules(getType ? parseFloat(getType.min_width) : 0),
              buttonCanvasRules(maxwidth, 0)
            ]"
            style="padding-bottom: 35px; min-width: 255px"
            rounded
            outlined>
              <template v-slot:label>
                <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                  Ancho de {{ widthMargins }} metros
                </em>
              </template>
            </q-input>
            <q-input
            stack-label
            label-slot
            type="number"
            :dense="true"
            v-model.number="order.canvas[0].height"
            :rules="[
              ...heightCanvasRules(getType ? parseFloat(getType.min_height) : 0, maxheight)
            ]"
            rounded
            style="min-width: 255px"
            outlined>
            <template v-slot:label>
                <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                  Alto de {{ heightMargins }} metros
                </em>
              </template>
            </q-input>
          </div>
        </q-form>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 3" color="primary" icon="arrow_upward" flat rounded></q-btn>
         <q-space></q-space>
          <q-btn size="sm" stretch color="primary" @click="canvasDialog = true" v-if="showButtonDialog" label="agregar más lienzos" ></q-btn>
          <q-space></q-space>
          <q-btn @click="checkSizes()" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      v-if="order.type == 'sheer' || order.type == 'triple-shade-shangri-la' || order.type == 'romantic'"
      :name="5"
      :title="order.instalation_side != null? `Instalación a: ${order.instalation_side}` : 'Selecciona tipo de instalación'"
      prefix="5"
      :done="step > 5"
      >
        <q-option-group
        v-model="order.instalation_side"
        :options="instalation_side_options"
        color="primary"
        inline
        ></q-option-group>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 4" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn @click="step = 6" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="6"
      :title="order.motor_type != null? `Accionamiento: ${order.motor_type}` : 'Selecciona Accionamiento'"
      prefix="6"
      :done="step > 6"
      >
      <q-list separator>
        <q-item
        @click="checkDrive(option.value)"
        :active="order.motor_type === option.value"
        active-class="bg-teal-1"
        clickable
        v-ripple
        v-for="(option, index) in motor_type_options" :key="index">
          <q-item-section>{{option.label}}</q-item-section>
          <q-item-section avatar>
            <q-icon  :name="option.icon"></q-icon>
          </q-item-section>
        </q-item>
      </q-list>
        <!-- <q-option-group
        @click="checkDrive()"
        v-model="order.motor_type"
        :options="motor_type_options"
        color="primary"
        inline
        ></q-option-group> -->
        <q-stepper-navigation class="flex">
          <q-btn @click="motorTypeBack" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn @click="addBlind()" color="orange" :label="finishTitle" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      </div>
    </q-stepper>
    <q-footer>
      <q-tabs v-model="tab" class="text-white" :mobile-arrows="false" :outside-arrows="false" :narrow-indicator="false">
        <q-tab>
          <div
          v-if="order.type == 'horizontal-madera-2'"
          style="font-size: 1em !important;line-height: normal;" >
            PERSIANA: {{ mxCurrencyFormat.format(findWoodPrice) }} MXN
          </div>
          <div
          v-else
          style="font-size: 1em !important;line-height: normal;" >
            PERSIANA:  {{ mxCurrencyFormat.format(unitaryPrice + parseFloat(extraEnrollablePrice) + parseFloat(extraVerticalPrice)) }} MXN
          </div>
          <div v-if="order.celular_variant != null">
            MOTOR:
            {{
              mxCurrencyFormat.format(motorCelularPrice())
            }}
            MXN
          </div>
          <div v-else>
            MOTOR:
            {{
              mxCurrencyFormat.format(
                order.motor.price +
                order.motor.flexiballetPrice +
                order.motor.galleryPrice +
                order.motor.manufacturerPrice +
                order.motor.stringPrice
              )
            }}
            MXN
          </div>
        </q-tab>
        <q-route-tab :to="{name:'Quoted'}">
          <!-- <q-badge color="red" floating>{{ $store.state.orders.orders.length }} </q-badge> -->
          TOTAL:
          <div style="font-size: 1em !important;line-height: normal;" >
              {{mxCurrencyFormat.format($store.getters.totalPrice) }} MXN
          </div>
        </q-route-tab>
      </q-tabs>
    </q-footer>
    <q-dialog v-model="canvasDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="text-primary">
        <q-card-section>
          Indique ancho y alto para cada lienzo
        </q-card-section>
        <q-form ref="canvasForm">
          <q-card-section  v-for="(canvas, index) in order.canvas" :key="index">
            <q-img src="https://rollux.com.mx/img/cotizador/canvas.png">
            <div
            style="margin-top: -10px"
            class="bg-transparent absolute-top text-center text-primary">
              <span class="text-bold" >Lienzo {{ index + 1 }}</span>
            </div>
            <div class="bg-transparent absolute-right flex flex-center">
                <q-input
                no-error-icon
                type="number"
                dense
                :rules="[
                  ...widthCanvasRulesTwo(getType ? parseFloat(getType.min_width) : 0, maxwidth)
                ]"
                style="width: 60px; margin-right: -7px;"
                v-model.number="order.canvas[index].height"
                suffix="mts">
                </q-input>
              </div>
              <div class="bg-transparent absolute-bottom flex justify-center">
                <q-input
                no-error-icon
                :rules="[
                  ...heightCanvasRules(getType ? parseFloat(getType.min_height) : 0, maxheight)
                ]"
                type="number"
                dense
                style="width: 60px; margin-bottom: -19px;"
                v-model.number="order.canvas[index].width"
                suffix="mts">
                </q-input>
              </div>
            </q-img>
          </q-card-section>
        </q-form>
        <q-card-actions align="center">
          <q-btn
          @click="addCanvas"
          v-if="order.canvas.length < 3"
          flat
          round
          icon="add">
          </q-btn>
          <q-btn
          @click="deleteCanvas"
          v-if="order.canvas.length > 1"
          flat
          round
          icon="remove"
          color="red">
          </q-btn>
        </q-card-actions>
        <q-separator></q-separator>
        <q-card-actions align="around">
          <q-btn flat label="aceptar" @click="validateCanvas" color="primary"></q-btn>
          <q-btn flat label="cancelar" @click="cancelCanvas" color="red"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="flexibaletDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">¿Desea continuar?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
         Motorizar las persianas FLEXIBALET añadirá un costo extra de $25,500.00 MXN a la cotización.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="NO" color="red" v-close-popup></q-btn>
          <q-space></q-space>
          <q-btn flat label="SÍ" @click="openDriveOptions()" color="primary"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import woodMatrix from 'src/utils/woodMatrixOne'
import woodMotorized from 'src/utils/woodMatrixTwo'
export default {
  data () {
    return {
      editable: this.isEditing,
      celular_variants: [
        { title: 'CELULAR BOLERO 25 MM (3.66 MM)', day: 'BOLERO TRASLUCIDA', night: 'BOLERO BLACKOUT' },
        { title: 'CELULAR ROMANCE 25 MM (3.66 MM)', day: 'ROMANCE TRASLUCIDA', night: 'ROMANCE BLACKOUT' },
        { title: 'CELULAR SOLIS 38 MM 118\'\' (3.00)', day: 'SOLIS TRASLUCIDA', night: 'SOLIS TRASLUCIDA' }
      ],
      celular_drive_options: [
        {
          label: 'Muelle',
          value: 'Muelle'
        },
        {
          label: 'Cordón',
          value: 'Cordón'
        },
        {
          label: 'Motor',
          value: 'Motor'
        }
      ],
      celulares: [
        { title: 'Día y Noche', img: 'http://rollux.com.mx/img/cotizador/celulares/dianoche.png' },
        { title: 'Muelle/Cordón', img: 'http://rollux.com.mx/img/cotizador/celulares/Muelle.png' }
      ],
      active: true,
      flexibaletDialog: false,
      canvasDialog: false,
      motor_frame_options: [
        {
          label: 'Fuera',
          value: 'fuera'
        },
        {
          label: 'Adentro',
          value: 'adentro'
        }
      ],
      motor_sidecontrol_options: [
        {
          label: 'Izquierdo',
          value: 'Izquierdo'
        },
        {
          label: 'Derecho',
          value: 'Derecho'
        }
      ],
      motor_drive_options: [
        {
          label: 'Escalerilla',
          value: 'escalerilla',
          disable: false
        },
        {
          label: 'Cinta',
          value: 'cinta',
          disable: false
        }
      ],
      cloth_holder_options: [
        {
          label: 'Con galeria PVC',
          value: 'Galería PVC'
        },
        {
          label: 'Con galería Portatela',
          value: 'Galería Portatela'
        }
      ],
      instalation_side_options: [
        {
          label: 'A techo',
          value: 'techo'
        },
        {
          label: 'A pared',
          value: 'pared'
        }
      ],
      motor_type_options: [
        {
          label: 'Manual',
          value: 'Manual',
          icon: 'wash',
          disable: false
        },
        {
          label: 'Motorizado',
          value: 'Motorizado',
          icon: 'settings_remote',
          disable: false
        }
      ],
      models: this.variants,
      step: this.externalStep,
      tab: null,
      showButtonDialog: false,
      disabledSelectColor: true,
      disabledSelectSize: true,
      loadingColors: false,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      disabledFrameRadio: true,
      order: {
        manufacturer: null,
        type: null,
        line: null,
        variant: null,
        variant2: null,
        color: null,
        second_color: null,
        canvas: [
          { width: null, height: null }
        ],
        celular_type: null,
        celular_drive: null,
        price: 0,
        motor_type: null,
        celular_variant: null,
        rotate: false,
        instalation_side: null,
        cloth_holder: null,
        extraEnrollable: 0,
        extraVertical: 0,
        motor: {
          height_control: null,
          drive: null,
          side_control: null,
          frame: null,
          motor: null,
          price: 0,
          control: null
        }
      },
      defaultOrder: {
        manufacturer: null,
        type: null,
        line: null,
        variant: null,
        variant2: null,
        color: null,
        second_color: null,
        canvas: [
          { width: null, height: null }
        ],
        celular_type: null,
        celular_drive: null,
        price: 0,
        motor_type: null,
        celular_variant: null,
        rotate: false,
        instalation_side: null,
        cloth_holder: null,
        extraEnrollable: 0,
        extraVertical: 0,
        motor: {
          height_control: null,
          drive: null,
          side_control: null,
          frame: null,
          motor: null,
          price: 0,
          control: null
        }
      },
      defaultMotor: {
        height_control: null,
        side_control: null,
        price: 0,
        action: null,
        type: null,
        canvas: 0,
        manufacturer: null,
        control: null,
        motor: 0,
        panels: 0,
        control_color: 0,
        selected_panel: 0,
        string_type: null,
        gallery: null,
        gallery_color: null,
        comment: null,
        instalation_side: null,
        frame: null,
        rail_color: null,
        drive: null,
        extra: 0,
        flexiballetPrice: 0,
        galleryPrice: 0,
        manufacturerPrice: 0,
        stringPrice: 0
      },
      widthMargins: null,
      heightMargins: null
    }
  },
  name: 'PageIndex',
  methods: {

    addBlind () {
      if (this.order.type === 'horizontal-madera-2') {
        this.order.price = this.findWoodPrice
      } else if (this.order.type === 'celular') {
        this.order.price = this.unitaryPrice
        this.order.motor.price = this.motorCelularPrice()
      } else if (this.order.type === 'vertical') {
        this.order.extraVertical = this.extraVerticalPrice
        this.order.price = this.unitaryPrice
      } else {
        this.order.extraEnrollable = this.extraEnrollablePrice * 1
        this.order.price = this.unitaryPrice
      }

      this.$store.dispatch('addToOrder', this.order).then(() => {
        this.$store.commit('setPartialBlind', this.defaultOrder)
        this.order = Object.assign({}, this.defaultOrder)
        this.order.motor = Object.assign({}, this.defaultMotor)
        this.order.canvas = [{ width: null, height: null }]
        this.step = 1
      })
    },

    addCanvas () {
      if (this.order.canvas.length < 3) {
        this.order.canvas.push({ width: null, height: null })
      }
    },

    assignCelularType (type) {
      this.order.celular_type = type
      this.order.variant = null
      this.order.variant2 = null
      this.order.color = null
      this.order.second_color = null
      this.order.celular_variant = null
    },

    buttonCanvasRules (max, index) {
      if (this.order.type === 'enrollable' || this.order.type === 'romana') {
        if (this.order.canvas[0].width > max) {
          this.showButtonDialog = true
        } else {
          this.showButtonDialog = false
        }
        return val => (val <= max) || 'Si tu ventana revasa los limites permitidos puedes agregar más lienzos'
      } else {
        this.showButtonDialog = false
        return val => (val <= max) || 'Máximo excedido'
      }
    },

    calculateHeightMargins (w) {
      if (this.getType.name === 'FLEXIBALET') {
        this.widthMargins = '1.00 a 22'
      } else {
        this.heightMargins = this.getType.min_height + ' a ' + w
      }
    },

    calculateWidthMargins (w) {
      this.widthMargins = this.getType.min_width + ' a ' + w
    },

    cancelCanvas () {
      this.order.canvas.length = 1
      this.canvasDialog = false
    },
    chargeCelularColors () {
      const variant1 = this.$store.state.products.variants.find(v => v.name.includes(this.order.celular_variant.day))
      const variant2 = this.$store.state.products.variants.find(v => v.name.includes(this.order.celular_variant.night))

      this.$store.dispatch('getRelatedColors', variant1.id).then(() => {
        this.order.variant = variant1.id
      })
      this.$store.dispatch('getRelatedColors2', variant2.id).then(() => {
        this.order.variant2 = variant2.id
        // this.loadingColors = false
        // this.disabledSelectColor = false
      })
    },

    chargeColors () {
      if (this.step === 2) {
        this.step = 3
      }
      this.loadingColors = true
      this.disabledSelectColor = true
      this.disabledSelectSize = true

      this.$store.dispatch('getRelatedColors', { slug: this.order.variant, type: this.order.type }).then(() => {
        this.loadingColors = false
        this.disabledSelectColor = false
        this.disabledSelectSize = false
        if (this.order.type === 'horizontal-aluminio-1' || this.order.type === 'horizontal-aluminio-2' || this.order.type === 'horizontal-madera-2') {
          this.order.color = this.colors[0]
          console.log('llegó aqui')
        }
      })
    },
    chargeTypeModels (type) {
      this.order = Object.assign({}, this.defaultOrder)
      this.order.motor = Object.assign({}, this.defaultMotor)
      this.order.type = type
      if (type === 'celular') {
        this.heightMargins = 1 + ' a ' + 3.00
        this.widthMargins = 0.60 + ' a ' + 3.00
      }
    },
    chargeWoodPrices () {
      if (this.order.motor_type === 'Manual') {
        this.widthMargins = woodMatrix[0].width + ' a ' + woodMatrix[10].width
        this.heightMargins = woodMatrix[0].height + ' a ' + woodMatrix[woodMatrix.length - 1].height
      } else if (this.order.motor_type === 'Motorizado') {
        this.widthMargins = woodMotorized[0].width + ' a ' + woodMotorized[8].width
        this.heightMargins = woodMotorized[0].height + ' a ' + woodMotorized[woodMotorized.length - 1].height
      }
    },

    checkSizes () {
      this.$refs.sizeform.validate().then(success => {
        if (success) {
          if (this.order.type === 'sheer' || this.order.type === 'triple-shade-shangri-la' || this.order.type === 'romantic') {
            this.step = 5
          } else {
            this.step = 6
          }
        }
      })
    },
    checkCelularSize () {
      this.$refs.sizecelularform.validate().then(success => {
        if (success) {
          this.step = 4
        }
      })
    },

    checkDrive (value) {
      this.order.motor_type = value
      if (this.order.type === 'flexibalet' && this.order.motor_type === 'Motorizado') {
        this.flexibaletDialog = true
      } else {
        this.openDriveOptions()
      }
    },

    deleteCanvas () {
      if (this.order.canvas.length > 1) {
        this.order.canvas.pop()
      }
    },

    filterFn (val, update, abort) {
      update(() => {
        this.models = this.variants.filter(v => v.name.includes(val))
      })
    },

    flexiballetHeightRules () {
      const w = parseFloat(this.order.canvas[0].width)
      if (w >= 1 && w <= 1.99) {
        this.heightMargins = 1 + ' a ' + 22
        return val => ((!isNaN(val) && val >= 1 && val <= 22)) || 'Requerido'
      } else if (w >= 2 && w <= 2.99) {
        this.heightMargins = 1 + ' a ' + 11
        return val => ((!isNaN(val) && val >= 1 && val <= 11)) || 'Requerido'
      } else if (w >= 3 && w <= 3.99) {
        this.heightMargins = 1 + ' a ' + 5
        return val => ((!isNaN(val) && val >= 1 && val <= 5)) || 'Requerido'
      } else if (w >= 4 && w <= 5.99) {
        this.heightMargins = 1 + ' a ' + 4
        return val => ((!isNaN(val) && val >= 1 && val <= 4)) || 'Requerido'
      } else if (w >= 6 && w <= 7.99) {
        this.heightMargins = 1 + ' a ' + 3
        return val => ((!isNaN(val) && val >= 1 && val <= 3)) || 'Requerido'
      } else if (w >= 8 && w <= 11.99) {
        this.heightMargins = 1 + ' a ' + 2
        return val => ((!isNaN(val) && val >= 1 && val <= 2)) || 'Requerido'
      } else if (w >= 12 && w <= 22) {
        this.heightMargins = 1 + ' a ' + 1
        return val => ((!isNaN(val) && val >= 1 && val <= 1)) || 'Requerido'
      }
      return val => true || 'Requerido'
    },

    flexiballetWidthRules () {
      return val => (
        (!isNaN(val) && val >= 1 && val <= 22) || 'Requerido'
      )
    },

    heightCanvasRules (min, max) {
      return val => (val && !isNaN(val) && (val <= max && val >= min)) || 'Requerido'
    },

    heightWoodRules () {
      return val => (!isNaN(val) && val >= 0.80 && val <= 3) || 'Requerido'
    },

    motorCelularPrice () {
      let price = 0
      if (this.order.motor.motor) {
        price += parseFloat(this.$store.getters.getMotor(this.order.motor.motor).price)
      }
      if (this.order.motor.control) {
        price += parseFloat(this.order.motor.control.price)
      }
      return price
    },

    motorTypeBack () {
      if (this.order.type === 'sheer' || this.order.type === 'triple-shade-shangri-la' || this.order.type === 'romantic') {
        this.step = 5
      }
      this.step = 4
    },

    openDriveOptions () {
      this.$store.dispatch('addPartialBlind', this.order).then(() => {
        this.$router.push({ name: 'Motorization', params: { externalStep: this.step } })
      })
    },

    selectColor () {
      this.disabledFrameRadio = false
      if (this.order.color.rotate) {
        this.rotate = true
      } else {
        this.rotate = false
      }
    },

    setModel (val) {
      this.model = val
    },

    validateCanvas () {
      this.$refs.canvasForm.validate().then(success => {
        if (success) {
          this.canvasDialog = false
        }
      })
    },

    widthCanvasRules (min) {
      return val => (val && !isNaN(val) && val >= min) || 'Requerido'
    },

    widthCanvasRulesTwo (min, max) {
      return val => (val && !isNaN(val) && val >= min && val <= max) || 'Requerido'
    },
    widthWoodRules () {
      if (this.order.motor_type === 'Manual') {
        return val =>
          (!isNaN(val) && val >= 0.60 && val <= 2.4) || 'Requerido'
      } else if (this.order.motor_type === 'Motorizado') {
        return (
          val => (!isNaN(val) && val >= 0.80 && val <= 2.4) || 'Requerido'
        )
      }
    },

    widthCelularRules () {
      return val => (!isNaN(val) && val >= 0.60 && val <= 3) || 'Requerido'
    },

    heightCelularRules () {
      return val => (!isNaN(val) && val >= 1 && val <= 3) || 'Requerido'
    }
  },

  computed: {
    ...mapState({
      colors: (state) => state.products.relatedColors,
      colors2: (state) => state.products.relatedColors2,
      orders: (state) => state.orders.orders,
      partial: (state) => state.orders.order,
      controls: (state) => state.motorization.controls,
      motorizations: (state) => state.motorization.motorizations
    }),
    preSideControlTitle () {
      if (this.order.motor_type === 'Motorizado') {
        return 'Selecciona lado del motor'
      } else if (this.order.motor_type === 'Manual') {
        return 'Selecciona lado del control'
      }
      return 'Selecciona lado del mando o motor'
    },

    afterSideControlTitle () {
      if (this.order.motor_type === 'Motorizado') {
        return 'Lado del motor: ' + this.order.motor.side_control
      } else if (this.order.motor_type === 'Manual') {
        return 'Lado del control: ' + this.order.motor.side_control
      }
      return null
    },

    celularMotors () {
      if (this.order.canvas[0].width) {
        return this.motorizations.filter(m => m.type === 'PERSIANAS CELULARES' && parseFloat(m.width) >= this.order.canvas[0].width)
      } else {
        return []
      }
    },

    extraEnrollablePrice () {
      let enrollablePrice = 0
      this.order.canvas.forEach(canvas => {
        if (canvas.width > 2.45) {
          enrollablePrice += 350
        }
      })
      return enrollablePrice
    },

    extraVerticalPrice () {
      if (this.order.type === 'vertical' && this.order.canvas[0].width != null) {
        if (this.order.cloth_holder === 'Galería PVC') {
          return Math.ceil(this.order.canvas[0].width) * 250
        } else if (this.order.cloth_holder === 'Galería Portatela') {
          return Math.ceil(this.order.canvas[0].width) * 120
        }
      }
      return 0
    },

    findWoodPrice () {
      let result = 'Medida no válida'
      if (this.order.motor_type === 'Manual') {
        result = woodMatrix.filter((m) => m.width >= this.order.canvas[0].width && m.height >= this.order.canvas[0].height)
      } else if (this.order.motor_type === 'Motorizado') {
        result = woodMotorized.filter((m) => m.width >= this.order.canvas[0].width && m.height >= this.order.canvas[0].height)
      }
      if (result[0]) {
        if (this.order.motor_type === 'Manual' && this.order.motor.drive === 'cinta') {
          return result[0].price + (result[0].price * 0.15)
        } else {
          return result[0].price
        }
      }
      return result
    },

    finishTitle () {
      if (this.order.type === 'panel-japones') {
        return this.editable ? 'terminar edición' : 'terminar panel japonés'
      } else {
        return this.editable ? 'terminar edición' : 'terminar persiana'
      }
    },

    getProduct () {
      return this.$store.getters.getTypes('PERSIANAS')
    },

    getType () {
      if (this.getProduct && this.order.type) {
        return this.getProduct.types.find(
          (type) => type.slug === this.order.type
        )
      }
      return null
    },

    lines () {
      if (this.getType) return this.$store.getters.getLines(this.getType.slug)
      return null
    },

    maxheight () {
      if (this.getType && this.variant) {
        if (this.order.rotate) {
          this.calculateHeightMargins(this.variant.width - 2)
          return (this.variant.width - 0.2)
        }
        if (parseFloat(this.getType.max_height) <= 0) {
          this.calculateHeightMargins(this.maxwidth)
          return this.maxwidth
        } else {
          this.calculateHeightMargins(parseFloat(this.getType.max_height))
          return parseFloat(this.getType.max_height)
        }
      } else {
        return 0
      }
    },

    maxwidth () {
      if (this.getType && this.variant) {
        if (this.order.rotate) {
          this.calculateWidthMargins(this.getType.max_width_rot)
          return (this.getType.max_width_rot)
        }
        if (parseFloat(this.getType.max_width) <= 0) {
          this.calculateWidthMargins(parseFloat(this.variant.width) - parseFloat(this.getType.profit_margin))
          return (parseFloat(this.variant.width) - parseFloat(this.getType.profit_margin)).toFixed(2)
        } else {
          this.calculateWidthMargins(parseFloat(this.getType.max_width))
          return parseFloat(this.getType.max_width).toFixed(2)
        }
      } else {
        return 0
      }
    },

    variants () {
      if (this.order.type === 'vertical' && this.order.line) {
        return this.$store.state.products.variants.filter(
          (variant) => variant.type.slug === this.order.type && variant.weave.slug === this.order.line
        )
      } else if (this.order.type && this.order.line && this.order.manufacturer) {
        return this.$store.state.products.variants.filter(
          (variant) =>
            variant.type.slug === this.order.type && variant.line.slug === this.order.manufacturer && variant.weave.slug === this.order.line
        )
      } else if (this.order.type && this.order.manufacturer) {
        return this.$store.state.products.variants.filter(
          (variant) => variant.type.slug === this.order.type && variant.line.slug === this.order.manufacturer
        )
      }
      return null
    },

    variant () {
      if (this.order.variant && this.order.type) {
        return this.$store.state.products.variants.find(
          (variant) => variant.slug === this.order.variant && variant.type.slug === this.order.type
        )
      }
      return null
    },

    variantTwo () {
      if (this.order.variant2 && this.order.type) {
        return this.$store.state.products.variants.find(
          (variant) => variant.slug === this.order.variant2 && variant.type.slug === this.order.type
        )
      }
      return null
    },

    unitaryPrice () {
      if (this.order.variant2 != null) {
        const partialHeight = this.order.canvas[0].height / 2
        let price = 0
        if (this.order.canvas[0].width > 1 && partialHeight > 1) {
          return parseFloat((this.variant.price * this.order.canvas[0].width * partialHeight) + (this.variantTwo.price * this.order.canvas[0].width * partialHeight))
        } else if (this.order.canvas[0].width > 1) {
          price = parseFloat((this.variant.price * this.order.canvas[0].width) + (this.variantTwo.price * this.order.canvas[0].width))
          return price
        } else if (partialHeight > 1) {
          price = parseFloat((this.variant.price * partialHeight) + (this.variantTwo.price * partialHeight))
          return price
        } else {
          price = parseFloat(this.variant.price) + parseFloat(this.variantTwo.price)
          return price
        }
      } else if (this.order.canvas.length > 0 && this.variant) {
        let price = 0
        for (let index = 0; index < this.order.canvas.length; index++) {
          if (this.order.canvas[index].width > 1 && this.order.canvas[index].height > 1) {
            price += parseFloat(this.variant.price * this.order.canvas[index].width * this.order.canvas[index].height)
          } else if (this.order.canvas[index].width > 1) {
            price += parseFloat(this.variant.price * this.order.canvas[index].width)
          } else if (this.order.canvas[index].height > 1) {
            price += parseFloat(this.variant.price * this.order.canvas[index].height)
          } else {
            price += parseFloat(this.variant.price)
          }
        }
        return price
      } else if (this.variant) {
        return this.variant.price
      } else {
        return 0
      }
    }
  },

  mounted () {
    this.order = Object.assign({}, this.partial)
  },

  watch: {
    step: function (val) {
      if (val === 6 && (this.order.type === 'horizontal-aluminio-1' || this.order.type === 'horizontal-aluminio-2' || this.order.type === 'vertical')) {
        this.motor_type_options[1].disable = true
      } else {
        this.motor_type_options[1].disable = false
      }

      if (val === 3 && this.order.motor_type === 'Motorizado') {
        this.motor_drive_options[1].disable = true
      } else {
        this.motor_drive_options[1].disable = false
      }
    }
  },

  props: {
    externalStep: {
      type: Number,
      required: false,
      default: 1
    },

    isEditing: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style>
.selected-celular-type{
  border: 1px solid #47a5ad;
}
</style>
