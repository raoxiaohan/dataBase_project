# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Administors(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=20, blank=True, null=True)
    password = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'administors'


class Airport(models.Model):
    id = models.IntegerField(blank=True, null=True)
    city = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    name = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'airport'


class AllPlanes(models.Model):
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
        managed = False
        db_table = 'all_planes'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Chat(models.Model):
    type = models.CharField(max_length=1, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    time = models.DateTimeField(blank=True, null=True)
    username = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chat'


class Chengdu(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=20, blank=True, null=True)
    comment = models.CharField(max_length=40, blank=True, null=True)
    text = models.CharField(max_length=40, blank=True, null=True)
    image = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chengdu'


class Coupons(models.Model):
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
        managed = False
        db_table = 'coupons'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Linkman(models.Model):
    name = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'linkman'


class Order(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    plane_num = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)
    time = models.CharField(max_length=20, blank=True, null=True)
    date = models.CharField(max_length=20, blank=True, null=True)
    dep_date = models.CharField(max_length=20, blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)
    linkman_phone = models.CharField(max_length=20, blank=True, null=True)
    linkman_name = models.CharField(max_length=20, blank=True, null=True)
    passenger_num = models.IntegerField(blank=True, null=True)
    passengers_id = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'order'


class Orders(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    plane_id = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)
    time = models.CharField(max_length=20, blank=True, null=True)
    date = models.CharField(max_length=20, blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)
    linkman_phone = models.CharField(max_length=20, blank=True, null=True)
    linkman_name = models.CharField(max_length=20, blank=True, null=True)
    passenger_num = models.IntegerField(blank=True, null=True)
    passengers_id = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orders'


class PassSeats(models.Model):
    order_id = models.IntegerField(blank=True, null=True)
    pass_id = models.IntegerField(blank=True, null=True)
    seat = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pass_seats'


class Passenger(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    cardnum = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'passenger'


class Plane(models.Model):
    id = models.IntegerField(blank=True, null=True)
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
        managed = False
        db_table = 'plane'


class PlaneLevel(models.Model):
    plane_id = models.IntegerField(primary_key=True)
    simple_price = models.IntegerField(blank=True, null=True)
    hign_price = models.IntegerField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'plane_level'


class Search(models.Model):
    start = models.CharField(max_length=20, blank=True, null=True)
    end = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'search'


class Seats(models.Model):
    plane_id = models.IntegerField(primary_key=True)
    seats = models.TextField(blank=True, null=True)
    remind = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seats'


class User(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    image = models.CharField(max_length=200, blank=True, null=True)
    credit = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'


class UserCou(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    cou_id = models.IntegerField(blank=True, null=True)
    start_time = models.CharField(max_length=20, blank=True, null=True)
    end_time = models.CharField(max_length=20, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_cou'


class WxLoginUserinfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=18)
    email = models.CharField(max_length=50)
    sex = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'wx_login_userinfo'
