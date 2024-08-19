<template>
     <section class="flex flex-col flex-1 justify-center">
          <div class="wrapper-xsmall">
               <div class=" bg-white p-4 rounded-md shadow-md">
                    <div class="flex justify-center gap-x-4">
                         <h1 class="text-center font-semibold mb-4">Register</h1>
                         <NuxtLink class="text-center font-semibold mb-4 text-gray-400 hover:text-black" to="/login">
                              Login
                         </NuxtLink>
                    </div>
                    <el-form ref="registerFormRef" :model="registerForm" status-icon :rules="rules"
                         class="demo-registerForm ">
                         <el-form-item prop="name">
                              <el-input placeholder="name" v-model="registerForm.name" />
                         </el-form-item>

                         <el-form-item prop="email">
                              <el-input placeholder="Email" v-model="registerForm.email"></el-input>
                         </el-form-item>
                         <el-form-item prop="password">
                              <el-input v-model="registerForm.password" placeholder="Password" type="password"
                                   autocomplete="off" :show-password="true" />
                         </el-form-item>
                         <el-form-item prop="checkPass">
                              <el-input v-model="registerForm.checkPass" type="password" placeholder="Repeat password"
                                   autocomplete="off" :show-password="true" />
                         </el-form-item>
                         <el-form-item>
                              <el-button role="button" :disabled="isLoading || !allFieldsFilled" :loading="isLoading"
                                   class="mt-4 mx-auto" type="primary" @click="submitForm(registerFormRef)">
                                   Create account
                              </el-button>

                         </el-form-item>

                         <p class="mt-8 mb-4 text-center font-bold">Or go with:</p>
                         <div class="flex justify-center">
                              <el-button class="p-6" @click="submitSocial('google')">
                                   <img style="max-width: 21px;" :src="googleIcon" alt="Google Icon" />
                              </el-button>
                         </div>
                    </el-form>
               </div>

          </div>

     </section> 
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import googleIcon from "~/assets/icons/google_IC.png";
// import githubIcon from "~/assets/icons/github_IC.png";

const { signIn, data, status, getProviders } = useAuth();
const providers = await getProviders();

const isLoading = ref(false);
const registerFormRef = ref<FormInstance>();

const allFieldsFilled = computed(() => {
     return Object.values(registerForm).every(value => value !== '');
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
const checkEmail = (rule: any, value: any, callback: any) => {
     if (!value) {
          return callback(new Error('Please input email'))
     }
     value = value.trim();
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(value)) {
          callback(new Error('Please input a valid email address'));
     } else {
          callback();
     }
};

const validatePass = (rule: any, value: any, callback: any) => {
     value = value.trim();
     const passwordRegex = /^\S*$/;
     if (value === '') {
          callback(new Error('Please input the password'));
     } else if (!passwordRegex.test(value)) {
          callback(new Error('Password should not contain spaces'));
     } else {
          if (registerForm.checkPass !== '') {
               if (!registerFormRef.value) return
               registerFormRef.value.validateField('checkPass', () => null);
          }
          callback();
     }
};

const validatePass2 = (rule: any, value: any, callback: any) => {
     if (value === '') {
          callback(new Error('Please input the password again'));
     } else if (value !== registerForm.password) {
          callback(new Error("Two inputs don't match!"));
     } else {
          callback();
     }
};

const registerForm = reactive({
     name: '',
     email: '',
     password: '',
     checkPass: '',
});

const rules = reactive<FormRules<typeof registerForm>>({
     name: [{ validator: checkName, trigger: 'blur' }],
     email: [{ validator: checkEmail, trigger: 'blur' }],
     password: [{ validator: validatePass, trigger: 'blur' }],
     checkPass: [{ validator: validatePass2, trigger: 'blur' }],
});



const submitForm = (formEl: FormInstance | undefined) => {
     if (!formEl) return
     formEl.validate(async (valid) => {
          if (valid) {
               try {
                    isLoading.value = true;
                    const data = await $fetch("/api/auth/register", {
                         method: "POST",
                         body: {
                              name: registerForm.name,
                              email: registerForm.email,
                              password: registerForm.password,
                         },
                         server: false
                    });
                    if (data) {
                         setTimeout(() => {
                              isLoading.value = false;
                              ElNotification({
                                   title: 'Success',
                                   message: 'User created',
                                   type: 'success',
                              })
                              useRouter().push({
                                   name: 'login'
                              })
                         }, 1200);
                         formEl.resetFields();
                    }


               } catch (error: any) {
                    if (error.statusCode === 409) {
                         setTimeout(() => {
                              isLoading.value = false;
                              ElNotification({
                                   title: 'Warning',
                                   message: 'User already registered',
                                   type: 'warning',
                              });
                         }, 1200);
                    }
                    if (error.statusCode === 400) {
                         ElNotification({
                              title: 'Warning',
                              message: 'Missing required fields',
                              type: 'warning',
                         });
                    }
                    formEl.resetFields();
               }
          }
     })
};



const submitSocial = async (action: string) => {
     try {
          await signIn(action, { callbackUrl: '/' });      

     } catch (error) {
          console.error("Error during social authentication:", error);
          
          ElNotification({
               title: 'Error',
               message: 'Something went wrong',
               type: 'error',
          });
     }

}


</script>