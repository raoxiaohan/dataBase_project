from django.db import models


# Create your models here.
# username,password,email,sex
# 一个类对应数据库中的一张表
# 所有的类必须继承models.Model类
class Search(models.Model):
    start = models.CharField(max_length=20, blank=True, null=True)
    end = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'search'


class User(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    name = models.CharField(max_length=20, blank=True, null=True)
    image = models.CharField(max_length=200, blank=True, null=True)
    credit = models.IntegerField(blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'user'


class Airport(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    city = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    name = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'airport'


class Plane(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    name = models.CharField(max_length=15, blank=True, null=True)
    num = models.CharField(max_length=15, blank=True, null=True)
    dep_time = models.CharField(max_length=15, blank=True, null=True)
    dep_airport = models.CharField(max_length=15, blank=True, null=True)
    dep_city = models.CharField(max_length=15, blank=True, null=True)
    arr_time = models.CharField(max_length=15, blank=True, null=True)
    arr_airport = models.CharField(max_length=15, blank=True, null=True)
    arr_city = models.CharField(max_length=15, blank=True, null=True)
    punctuality = models.CharField(max_length=15, blank=True, null=True)
    price = models.CharField(max_length=15, blank=True, null=True)
    date = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'plane'


class Coupons(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    name = models.CharField(max_length=20, blank=True, null=True)
    min = models.IntegerField(blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)
    num = models.IntegerField(blank=True, null=True)
    ori_num = models.IntegerField(blank=True, null=True)
    rule = models.TextField(blank=True, null=True)
    start_time = models.CharField(max_length=20, blank=True, null=True)
    end_time = models.CharField(max_length=20, blank=True, null=True)
    valid = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'coupons'


class Order(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    user_id = models.IntegerField(blank=True, null=True)
    plane_num = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    date = models.CharField(max_length=20, blank=True, null=True)
    dep_date = models.CharField(max_length=20, blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)
    linkman_phone = models.CharField(max_length=20, blank=True, null=True)
    linkman_name = models.CharField(max_length=20, blank=True, null=True)
    passenger_num = models.IntegerField(blank=True, null=True)
    passengers_id = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'order'


class Passenger(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    user_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    cardnum = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'passenger'


class Linkman(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    name = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'linkman'


class UserCou(models.Model):
    # id = models.IntegerField(blank=True, primary_key=True)
    user_id = models.IntegerField(blank=True, null=True)
    cou_id = models.IntegerField(blank=True, null=True)
    start_time = models.CharField(max_length=20, blank=True, null=True)
    end_time = models.CharField(max_length=20, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'user_cou'


class Chengdu(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    comment = models.CharField(max_length=40, blank=True, null=True)
    text = models.CharField(max_length=40, blank=True, null=True)
    image = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'chengdu'


class AllPlanes(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    name = models.CharField(max_length=30, blank=True, null=True)
    num = models.CharField(max_length=50, blank=True, null=True)
    dep_time = models.CharField(max_length=15, blank=True, null=True)
    dep_airport = models.CharField(max_length=30, blank=True, null=True)
    dep_city = models.CharField(max_length=15, blank=True, null=True)
    arr_time = models.CharField(max_length=15, blank=True, null=True)
    arr_airport = models.CharField(max_length=30, blank=True, null=True)
    arr_city = models.CharField(max_length=15, blank=True, null=True)
    price = models.CharField(max_length=15, blank=True, null=True)
    date = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'all_planes'


class Seats(models.Model):
    plane_id = models.IntegerField(blank=True, primary_key=True)
    seats = models.TextField(blank=True, null=True)
    remind = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'seats'


class PassSeats(models.Model):
    id = models.IntegerField(blank=True, primary_key=True)
    order_id = models.IntegerField(blank=True, null=True)
    pass_id = models.IntegerField(blank=True, null=True)
    seat = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pass_seats'


class PlaneLevel(models.Model):
    plane_id = models.IntegerField(primary_key=True)
    simple_price = models.IntegerField(blank=True, null=True)
    hign_price = models.IntegerField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'plane_level'

