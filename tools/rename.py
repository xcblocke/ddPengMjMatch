# -*- coding: utf-8 -*-
import os
import re
import sys

# 设置默认编码为 UTF-8
reload(sys)
sys.setdefaultencoding('utf-8')

def rename_images(path):
    """
    修改指定路径下所有图片名，去除 '@2x'
    例如：S@2x.png -> S.png
    """
    # 支持的图片格式
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'}
    
    if not os.path.exists(path):
        print u"错误：路径 '{}' 不存在".format(path)
        return
    
    # 获取目录下所有文件
    files = os.listdir(path)
    renamed_count = 0
    
    for filename in files:
        file_path = os.path.join(path, filename)
        
        # 跳过目录
        if os.path.isdir(file_path):
            continue
        
        # 获取文件名和扩展名
        name, ext = os.path.splitext(filename)
        
        # 只处理支持的图片格式
        if ext.lower() not in image_extensions:
            continue
        
        # 检查文件名中是否包含 '@2x'
        if '@2x' in name:
            # 去除所有的 '@2x'
            new_name = name.replace('@2x', '')
            
            # 如果替换后为空字符串，跳过
            if not new_name:
                print u"警告：'{}' 去除 '@2x' 后为空，跳过".format(filename)
                continue
            
            new_filename = new_name + ext
            new_file_path = os.path.join(path, new_filename)
            
            # 如果新文件名已存在，添加序号
            counter = 1
            while os.path.exists(new_file_path):
                name_without_ext = new_name
                new_filename = u"{}_{}{}".format(name_without_ext, counter, ext)
                new_file_path = os.path.join(path, new_filename)
                counter += 1
            
            try:
                os.rename(file_path, new_file_path)
                print u"✓ 重命名：'{}' -> '{}'".format(filename, os.path.basename(new_file_path))
                renamed_count += 1
            except Exception as e:
                print u"✗ 重命名失败 '{}': {}".format(filename, e)
        else:
            print u"跳过：'{}'（不包含 '@2x'）".format(filename)
    
    print u"\n完成！共重命名 {} 个文件".format(renamed_count)

if __name__ == "__main__":
    # 请修改这里的路径为你的目标文件夹路径
    target_path = "/Users/lockexu/Documents/work/ddMjMatch/tools/shuzi/xiaoxie_slices"
    
    # 确认执行（使用英文提示避免编码问题）
    print "\nWill process path: {}".format(target_path)
    confirm = raw_input("Confirm? (y/n): ").strip().lower()
    
    if confirm == 'y':
        rename_images(target_path)
    else:
        print "Operation cancelled"