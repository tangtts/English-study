import { ExecutionContext, SetMetadata, applyDecorators, createParamDecorator } from '@nestjs/common';
import { IsEmpty, IsString,IsNotEmpty, ValidationOptions, registerDecorator, ValidationArguments, notEquals } from 'class-validator';

export const  RequireLogin = () => SetMetadata('require-login', true);

// 不需要校验token
export const  PublicApi = () => SetMetadata('public-api', true);

export function IsStringAndNotEmpty(){
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
  )
}

/**
 * 
 * 获取 user信息，比如 userid
 */
export const UserInfo = createParamDecorator((data:string,ctx:ExecutionContext)=>{
  const request = ctx.switchToHttp().getRequest();
  if(request.user){
    return data ? request.user[data] : request.user;
  }
  return null;
})


/**
 *
 * 自定义class-validator 判断两个值是否相等
 * @export
 * @param {string} property
 * @param {ValidationOptions} [validationOptions]
 * @return {*} 
 */
export function IsSameValue(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isSameValue",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return notEquals(value,relatedValue);
        },
      },
    });
  };
}