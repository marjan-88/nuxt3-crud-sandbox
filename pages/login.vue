<template>
  <section class="flex flex-col flex-1 justify-center">
     <!-- class="wrapper-primary p-2" -->
       <div class="wrapper-xsmall ">
            <div class="bg-white p-4 rounded-md shadow-md">
                 <div class="flex justify-center gap-x-4">
                      <h1 class="text-center font-semibold mb-4">Log in</h1>
                      <NuxtLink class="text-center font-semibold mb-4 text-gray-400 hover:text-black" to="/register" >
                           Register
                      </NuxtLink>
                 </div>               

                 <el-form ref="loginFormRef" @submit.prevent :model="loginForm" :rules="rules" class="loginForm">
                      <el-form-item prop="name">
                           <el-input placeholder="Name" v-model="loginForm.name" />
                      </el-form-item>

                      <el-form-item prop="password">
                           <el-input v-model="loginForm.password" placeholder="Password" type="password"
                                autocomplete="off" :show-password="true" />
                      </el-form-item>
                                           
                      
                      <el-form-item>
                           <el-button :disabled="isLoading || !allFieldsFilled" :loading="isLoading" class="my-4 mx-auto"
                           native-type="button" type="primary" @click="submitForm(loginFormRef)">Confirm
                         </el-button>
                    </el-form-item>

                  

               </el-form>
            </div>
       </div>

  </section>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
// import googleIcon from "~/assets/icons/google_IC.png";
// import githubIcon from "~/assets/icons/github_IC.png";
const { signIn, data, status } = useAuth();

definePageMeta({
  middleware: "guest",
});
const isLoading = ref(false);
const loginFormRef = ref<FormInstance>();
const allFieldsFilled = computed(() => {
  return Object.values(loginForm).every(value => value !== '');
});
const checkName = (rule: any, value: any, callback: any) => {
  if (!value) {
       return callback(new Error('Please input a name'));
  }
  value = value.trim();
  const regex = /^[a-zA-Z\s]*$/;

  if (!regex.test(value)) {
       callback(new Error('Please input letters only'));
  } else {
       callback();
  }
};
const validatePass = (rule: any, value: any, callback: any) => {
  value = value.trim();
  if (value === '') {
       callback(new Error('Please input the password'))
  } else {
       callback();
  }
};
const loginForm = reactive({
  name: '',
  password: '',
});
const rules = reactive<FormRules<typeof loginForm>>({
  name: [{ validator: checkName, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
});

function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) return;

  formEl.validate(async (valid) => {
       if (valid) {
            isLoading.value = true;
            try {
                 const res = await signIn('credentials', loginForm);
               //   console.log(res);
                 useRouter().push({
                      name: "index",
                 });
                 isLoading.value = false;
            } catch (error) {
                 console.log(error);
            }

       } else {
            console.log('Form not valid')
            return;
       }
  })
}
</script>
