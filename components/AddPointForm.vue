<template>
     <div title="Add Point" :isVisible="dialogVisible" :isForm="true">
          <el-form :label-position="labelPosition" ref="formDialogRef" :rules="rules" :model="form" label-width="auto"
               class="flex flex-row gap-3  flex-wrap" status-icon>

               <el-form-item label="Name" class="basis-full" prop="name">
                    <el-input v-model="form.name" />
               </el-form-item>
               <el-form-item label="City" class="basis-full" prop="city">
                    <el-input v-model="form.city" />
               </el-form-item>
               <el-form-item label="Category" class="basis-full md:basis-1/1" prop="category">
                    <el-select v-model="form.category" multiple clearable collapse-tags placeholder="Select"
                         popper-class="custom-header" :max-collapse-tags="2" >
                         <template #header>
                              <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                                   All
                              </el-checkbox>
                         </template>
                         <el-option v-for="item in categories" :key="item.value" :value="item.value" />
                    </el-select>
               </el-form-item>
               <div class="flex flex-row flex-wrap md:flex-nowrap gap-3 basis-full">
               <el-form-item label="Lat" class="basis-full md:basis-1/2" prop="lat">
                    <el-input v-model.number="form.lat" type="text" />
               </el-form-item>
               <el-form-item label="Lng" class="basis-full md:basis-1/2" prop="lng">
                    <el-input v-model.number="form.lng" type="text" />
               </el-form-item>
              </div>
               <!-- <el-form-item label="Lat" class="basis-full md:basis-1/4" prop="lat">
                    <el-input v-model.number="form.lat" type="text" />
               </el-form-item>
               <el-form-item label="Lng" class="basis-full md:basis-1/4" prop="lng">
                    <el-input v-model.number="form.lng" type="text" />
               </el-form-item> -->
               <el-form-item label="Url" class="basis-full" prop="url">
                    <el-input v-model="form.url" />
               </el-form-item>
               <el-form-item label="Img" class="basis-full" prop="img">
                    <el-input v-model="form.img" />
               </el-form-item>
               <el-form-item label="Content" class="basis-full" prop="content">
                    <el-input v-model="form.content" type="textarea" :rows="2" placeholder="Treść" />
               </el-form-item>

          </el-form>
          <el-form-item class="remove-mb">
               <el-button  type="primary" @click="submitForm(formDialogRef, 'test')">Create and add Point</el-button>
          </el-form-item>
     </div>
</template>
<script setup lang="ts">
import type { MapPoint } from '~/types/MapPoint';
import type { FormInstance, FormRules } from 'element-plus';
import { useMapPointsStore } from '~/stores/MapPointsStore';
import type { CheckboxValueType, FormProps } from 'element-plus';
const labelPosition = ref<FormProps['labelPosition']>('top')
const { data } = useAuth();
import { isVisible } from 'element-plus/es/utils';
defineProps<{
     dialogVisible: boolean;
}>()
const emit = defineEmits(['form-submitted'])
const mapPointsStore = useMapPointsStore();
const formDialogRef = ref<FormInstance>();
const checkAll = ref(false)
const indeterminate = ref(false);
const categorySelect = ref<CheckboxValueType[]>([]);
const categories = ref([
     {
          value: 'red'
     },
     {
          value: 'green'
     },
     {
          value: 'blue'
     },
     {
          value: 'pink'
     },
     {
          value: 'violet'
     },
])

interface RuleForm extends Omit<MapPoint, '_id' | 'rating' | 'isFavorite' | 'createdAt' | 'updatedAt'>{};
const form = reactive<RuleForm>({
     name: '',
     city: '',
     category: '',
     lat: 0,
     lng: 0,
     url: '',
     img: '',
     content: '',
});

const rules = reactive<FormRules<RuleForm>>({
     name: [
          { required: true, message: 'Please enter name', trigger: 'blur' },
          { min: 3, max: 35, message: 'Length should be 3 to 35', trigger: 'blur' },
     ],
     city: [
          { required: true, message: 'Please enter city', trigger: 'blur' },
          { min: 3, max: 35, message: 'Length should be 3 to 35', trigger: 'blur' },
     ],
     category: [      
          { type: 'array', required: true,  message: 'Please select at least 1', trigger: 'change' },
     ],
     lat: [
          {
               required: true,
               message: 'Please enter latitude',
               trigger: 'change',
          },
          { type: 'number', message: 'lat must be a number' },
     ],
     lng: [
          {
               required: true,
               message: 'Please enter longtitude',
               trigger: 'change',
          },
          { type: 'number', message: 'lng must be a number' },
     ],
     img: [
          {
               required: true,
               message: 'Please enter im path',
               trigger: 'blur',
          },
     ],
     url: [
          {
               required: true,
               message: 'Please enter url',
               trigger: 'blur',
          },
     ],
     content: [
          {
               required: true,
               message: 'Please enter some content',
               trigger: 'blur',
          },
     ],

})
// const userID = computed(() => data.value?.user? ?? undefined);
// console.log('user', data.value?.user?.name);

const submitForm = async (formEl: FormInstance | undefined, userID: string) => {
     if (!formEl) return
    
     await formEl.validate(async(valid, fields) => {
          if (valid) {
               try {
                    const createdBy = data.value?.user?.name ?? 'Anonymous';
                    const newPoint: MapPoint = {
                         name: form.name,
                         city: form.city,
                         category: form.category,
                         lat: form.lat,
                         lng: form.lng,
                         url: form.url,
                         img: form.img,
                         content: form.content,
                         createdBy
                    };
                    await mapPointsStore.addPoint(newPoint);
                    emit('form-submitted');
               } catch (error) {
                    console.error('Error adding new point:', error);
               } finally {
                    formEl.resetFields();
               }     
               console.log('submit!')
          } else {
               console.log('error submit!', fields)
          }
     })
};

const handleCheckAll = (val: CheckboxValueType) => {
     indeterminate.value = false
     if (val) {
          categorySelect.value = categories.value.map((_) => _.value)
     } else {
          categorySelect.value = []
     }
}

watch(categorySelect, (val) => {
     console.log(categorySelect.value);
     if (val.length === 0) {
          checkAll.value = false
          indeterminate.value = false
     } else if (val.length === categories.value.length) {
          checkAll.value = true
          indeterminate.value = false
     } else {
          indeterminate.value = true
     }
})

</script>
<style lang="scss">
.custom-header {
     .el-checkbox {
          display: flex;
          height: unset;
     }
}
</style>
