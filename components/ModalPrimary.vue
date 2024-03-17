<template>
     <client-only>
          <el-dialog 
               ref="mDialog"
               class="m-dialog rounded-md "
               align-center
               v-model="isVisible" 
               :title="title"                
               :before-close="handleClose"
               :append-to-body="true"
               @opened="onOpened"
               >
               <slot></slot>
               <!-- width="w-11/12 md:w-1/2" -->
               <template #footer>
                    <div v-if="isForm">
                         <el-button @click="isVisible = false">Cancel</el-button>
                    </div>
                    <div v-else class="dialog-footer " >
                         <el-button @click="isVisible = false">Cancel</el-button>
                         <el-button type="primary" @click="isVisible = false">
                              Confirm
                         </el-button>

                    </div>                  
                    

               </template>
           
          </el-dialog>
     </client-only>
</template>
   
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

const mDialog = ref('mDialog');

const emit = defineEmits<{
     (e: 'opened'): void,
     (e: 'update:isVisible', value: boolean): void
}>()

const props = defineProps<{
     title: string,
     isVisible: boolean,
     isForm: boolean,
}>()
const isVisible = computed({
     get() {
          return props.isVisible;
     },
     set(isVisible) {
          emit('update:isVisible', isVisible)
     }
})
 
const onOpened = ()=>{
     // console.log('Dialog is opened and animations are done. - core');
     emit('opened');
}


const handleClose = (done: () => void) => {
     ElMessageBox.confirm('Are you sure to close this dialog?')
          .then(() => {
               done()
          })
          .catch(() => {
               // catch error
          })
}

     
</script>
<style lang="scss">
.el-dialog__footer {
     padding-top: 0;
}
.dialog-footer button:first-child {
     margin-right: 10px;
}
.m-dialog {
     width: 90%;
     padding: 1.5rem;
     @media(min-width: $sm){
          width: 80%;
     }
     @media(min-width: $md){
          width:70%;
     }
     @media(min-width: $lg){
          width: 35%;
     }
}
</style>
   