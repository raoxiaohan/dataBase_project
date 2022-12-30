from wx_login import views
from django.urls import path
__author__ = 'LXG'
__date__ = '2020/7/17 18:18'
#'wx_login/'即为二级路径
urlpatterns = [
    path('wx_login/', views.dispatcher)
]
