from celery import shared_task

@shared_task(ignore_result=False)
def say_hello():
    print(f"Inside the say_hello function")
    return "say hello"
 
@shared_task(ignore_result=True)
def add(x, y):
    return x+y