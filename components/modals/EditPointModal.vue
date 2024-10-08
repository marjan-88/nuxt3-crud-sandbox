<template>  
       <el-dialog 
           ref="eDialog" 
           class="m-dialog rounded-md " 
           align-center 
           v-model="localDialogVisible" 
           title="Edit Point"
           :append-to-body="true"
           @closed="onModalClosed"
       >
       <div>
           <el-form :label-position="labelPosition" ref="formDialogRef" :rules="rules" :model="form" label-width="auto"
               class="flex flex-col gap-3 " status-icon>
               <el-form-item label="Name" class="basis-full" prop="name">
                   <el-input v-model="form.name" />
               </el-form-item>
               <el-form-item label="City" class="basis-full" prop="city">
                   <el-input v-model="form.city" />
               </el-form-item>
               <el-form-item label="Category" class="basis-full " prop="category">
                   <el-select v-model="form.category" multiple clearable collapse-tags popper-class="custom-header"
                       :max-collapse-tags="2">
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
               <el-form-item label="Url" class="basis-full" prop="url">
                   <el-input v-model="form.url" />
               </el-form-item>
               <el-form-item label="Img" class="basis-full" prop="img">
                   <el-input v-model="form.img" />
               </el-form-item>
               <el-form-item label="Content" class="basis-full" prop="content">
                   <el-input v-model="form.content" type="textarea" :rows="2" />
               </el-form-item>

           </el-form>
           <el-form-item class="remove-mb">
               <el-button type="primary" @click="submitForm(formDialogRef)">Save changes</el-button>
           </el-form-item>
       </div>
   </el-dialog>

<!-- <client-only? -->

</template>
<script setup lang="ts">
import type { MapPoint } from '~/types/MapPoint';
import { dialogEmits, type FormInstance, type FormRules } from 'element-plus';
import { useMapPointsStore } from '~/stores/MapPointsStore';
import type { CheckboxValueType, FormProps } from 'element-plus';

const labelPosition = ref<FormProps['labelPosition']>('top')

const { data } = useAuth();

const eDialog = ref('eDialog');

const emit = defineEmits(['form-submitted', 'modal-closed','update:dialogVisible']);

const props = defineProps<{
    editedPoint: MapPoint,
    dialogVisible : boolean,
}>();

const localDialogVisible = computed({
  get: () => props.dialogVisible,
  set: (value) => emit('update:dialogVisible', value),
});

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
]);
interface RuleForm extends Omit<MapPoint, '_id' | 'rating' | 'isFavorite' | 'createdAt' | 'updatedAt'> { };

const form = reactive<RuleForm>({
    name: props.editedPoint.name,
    city: props.editedPoint.city,
    category: props.editedPoint.category || [],
    lat: props.editedPoint.lat,
    lng: props.editedPoint.lng,
    url: props.editedPoint.url,
    img: props.editedPoint.img,
    content: props.editedPoint.content,
});

categorySelect.value = (props.editedPoint.category as CheckboxValueType[]) || [];

const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: 'Please enter name', trigger: 'blur' },
        { min: 3, max: 35, message: 'Length should be 3 to 15', trigger: 'blur' },
    ],
    city: [
        { required: true, message: 'Please enter city', trigger: 'blur' },
        { min: 3, max: 35, message: 'Length should be 3 to 35', trigger: 'blur' },
    ],
    category: [
        { type: 'array', required: true, message: 'Please select at least 1', trigger: 'change' },
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

});

// const submitForm = async (formEl: FormInstance | undefined, userID: string | undefined) => {
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    //     const pointID = props.pointID || '';
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                const newPoint: MapPoint = {
                    name: form.name,
                    city: form.city,
                    category: categorySelect.value,
                    lat: form.lat,
                    lng: form.lng,
                    url: form.url,
                    img: form.img,
                    content: form.content,
                    //     createdBy: userID
                };
                if (props.editedPoint) {
                    const stringID = props.editedPoint._id!.toString();
                    await mapPointsStore.editPoint(stringID, newPoint);
                }
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
    indeterminate.value = false;
    if (val) {
        categorySelect.value = categories.value.map((_) => _.value);
    } else {
        categorySelect.value = [];
    }
    form.category = categorySelect.value;  // Sync with form category
};

watch(categorySelect, (val) => {
    console.log(categorySelect.value);
    if (val.length === 0) {
        checkAll.value = false;
        indeterminate.value = false;
    } else if (val.length === categories.value.length) {
        checkAll.value = true;
        indeterminate.value = false;
    } else {
        indeterminate.value = true;
    }
    form.category = val;  // Sync with form category
});

const onModalClosed = () => {
  emit('modal-closed'); // Emit modal closed event
};

</script>
<style lang="scss">
.custom-header {
    .el-checkbox {
        display: flex;
        height: unset;
    }
}
</style>
