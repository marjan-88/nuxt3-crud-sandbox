<template>
    <client-only>
        <el-dialog 
                ref="mDialog" 
                class="m-dialog rounded-md " 
                align-center 
                v-model="isAddPointModalOpened "                
                :before-close="handleClose" 
                :append-to-body="true"   
                title="Add Point"            
            >
            <div>                
                <!-- <div title="Add Point" dialog  :isForm="true"> -->
                <el-form :label-position="labelPosition" ref="formDialogRef" :rules="rules" :model="form"
                    label-width="auto" class="flex flex-row gap-3  flex-wrap" status-icon>

                    <el-form-item label="Name" class="basis-full" prop="name">
                        <el-input v-model="form.name" />
                    </el-form-item>
                    <el-form-item label="City" class="basis-full" prop="city">
                        <el-input v-model="form.city" />
                    </el-form-item>
                    <el-form-item label="Category" class="basis-full md:basis-1/1" prop="category">
                        <el-select v-model="form.category" multiple clearable collapse-tags placeholder="Select"
                            popper-class="custom-header" :max-collapse-tags="2">
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
                        <el-input v-model="form.content" type="textarea" :rows="2" placeholder="Treść" />
                    </el-form-item>

                </el-form>
                <el-form-item class="remove-mb">
                    <el-button type="primary" @click="submitForm(formDialogRef, 'test')">Create and add
                        Point</el-button>
                </el-form-item>
            </div>
            <template #footer>
                <!-- <div v-if="isForm">
                        <el-button @click="isAddPointModalOpened = false">Cancel</el-button>
                   </div> -->
                <div class="dialog-footer ">
                    <el-button @click="emit('closed')">Cancel</el-button>
                    <el-button type="primary" @click="emit('closed')">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </client-only>
</template>

<script lang="ts" setup>
import { useMapPointsStore } from '~/stores/MapPointsStore';
import { ElMessageBox } from 'element-plus'
import type { MapPoint } from '~/types/MapPoint';
import type { FormInstance, FormRules } from 'element-plus';
import type { CheckboxValueType, FormProps } from 'element-plus';

const isAddPointModalOpened = useState<boolean>('isAddPointModalOpened');
const mDialog = ref('mDialog');
const mapPointsStore = useMapPointsStore();
const formDialogRef = ref<FormInstance>();
const checkAll = ref(false)
const indeterminate = ref(false);
const labelPosition = ref<FormProps['labelPosition']>('top')
const { data } = useAuth();
interface RuleForm extends Omit<MapPoint, '_id' | 'rating' | 'isFavorite' | 'createdAt' | 'updatedAt'> { };
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

const emit = defineEmits<{
    (e: 'opened'): void,
    (e: 'closed'): void,
    (e: 'form-submitted'): void,
}>();

// defineProps<{
//     title: string,
//     dialogVisible : boolean,
// }>()


const onOpened = () => {
    console.log('ModalPrimary is opened and animations are done. - core');
    emit('opened');
}
const onClosed = () => {
    console.log('ModalPrimary is opened and animations are done. - core');
    emit('closed');
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
const submitForm = async (formEl: FormInstance | undefined, userID: string) => {
    if (!formEl) return

    await formEl.validate(async (valid, fields) => {
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
    // console.log(categorySelect.value);
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
watch(isAddPointModalOpened, (newVal) => {
    console.log('Modal visibility changed:', newVal);
});

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

    @media(min-width: $sm) {
        width: 80%;
    }

    @media(min-width: $md) {
        width: 70%;
    }

    @media(min-width: $lg) {
        width: 35%;
    }
}
</style>