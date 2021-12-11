<template>
    <q-page class="bg-primary">
        <q-card flat class="absolute-center bg-primary text-white">
          <img src="/img/white-r.svg" class="inout">
        </q-card>
    </q-page>
</template>

<script>
export default {

}
</script>

<style>
.inout{
  animation: float_pngRolluxInOut .5s infinite , scale 2s infinite;
}
@keyframes float_pngRolluxInOut{
    0%{
      transform: translatey(-85px) translatex(-20px);
    }
    50%{
      transform: translatey(-80px) translatex(-20px);
    }
    100%{
      transform: translatey(-85px) translatex(-20px);
    }
}
@keyframes scale{
    0%{
      transform: scale(.93);
    }
    50%{
      transform: scale(1);
    }
    100%{
      transform: scale(.93);
    }
}
</style>
